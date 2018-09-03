const execSh = require('exec-sh');
const macosVersion = require('macos-version');

class macOsBatteryHelper {

  /**
   * Returns the a promise that resolves to battery 0 (primary) charge percent.
   * Returns a number between 0 - 100 or -1 if the battery percentage can't be
   * determined (a desktop with no battery or some other issue.)
   *
   * @return {Promise<any>}
   */
  static getBatteryChargePercent() {
    return new Promise((resolve,reject) => {
      // Verify that we can support the particular OS
      const unsupportedOsMessage = MacOsBatteryHelperInternal.supportedOs();
      if (unsupportedOsMessage) {
        reject(unsupportedOsMessage);
        return;
      }
      // Pull the state from the OS
      MacOsBatteryHelperInternal.getBatteryStateFromMacOs()
        .then(currentBatteryState => {
          // With battery state, parse for what we're looking for...
          // If the returned state array has less than 2 lines, then we don't have a battery.
          if (currentBatteryState.length < 2) {
            // No battery, can't return
            resolve(-1);
          } else {
            // Pull the first battery's percent from array item 1 (the first battery)
            // The expected string looks like this
            // "* -InternalBattery-0 (id=5308515) 34%; charging; 5:58 remaining present: true"
            const bat0 = currentBatteryState[1];
            // A regex that looks for 1, 2 or 3 digits followed by '%;'.
            const myregexp = /(\d?\d?\d)%;/i;
            let percent;
            // Apply the regex
            const match = myregexp.exec(bat0);
            // Did we have a match?
            if (match) {
              // Yes, let's return as a number
              percent = parseInt(match[1]);
            } else {
              // No match, so we return -1 to indicate we can't pull a percentage
              percent = -1;
            }
            // Resolve
            resolve(percent);
          }
        })
        .catch(error => reject(error));
    });
  }

  /**
   * Returns a promise that resolves to the battery's charge state:
   *  discharging, charging, finishing charge, charged, no battery, undetermined
   *
   * @return {Promise<any>}
   */
  static getBatteryChargeState() {
    return new Promise((resolve,reject) => {
      // Verify that we can support the particular OS
      const unsupportedOsMessage = MacOsBatteryHelperInternal.supportedOs();
      if (unsupportedOsMessage) {
        reject(unsupportedOsMessage);
        return;
      }
      // Pull the state from the OS
      MacOsBatteryHelperInternal.getBatteryStateFromMacOs()
          .then(currentBatteryState => {
            // With battery state, parse for what we're looking for...
            // If the returned state array has less than 2 lines, then we don't have a battery.
            if (currentBatteryState.length < 2) {
              // No battery, can't return
              resolve('no battery');
            } else {
              // Pull the first battery's charge state from array item 1 (the first battery)
              // The expected string looks like this
              // "* -InternalBattery-0 (id=5308515) 34%; charging; 5:58 remaining present: true"
              const bat0 = currentBatteryState[1];
              // A regex that looks for the charging state words.
              const myregexp = /((?:dis)?charging|charged|finishing charge);/i;
              let percent;
              // Apply the regex
              const match = myregexp.exec(bat0);
              // Did we have a match?
              if (match) {
                // Yes, let's return the charging state
                percent = match[1];
              } else {
                // No match, so we return -1 to indicate we can't pull a percentage
                percent = 'undetermined';
              }
              // Resolve
              resolve(percent);
            }
          })
          .catch(error => reject(error));
    });
  }

}

module.exports = macOsBatteryHelper;

class MacOsBatteryHelperInternal {

  /**
   * Gets the state of the battery from the OS. Returns a Promise that resolves
   * with an array of the stdout.
   *
   * stdOut can be...
   *
   * Line 1 could be:
   * Now drawing from 'AC Power'
   * Now drawing from 'Battery Power'
   *
   * Line 2 could be: (If the device has a battery, otherwise, this line is absent)
   * -InternalBattery-0 (id=5308515)  34%; charging; 5:58 remaining present: true
   * -InternalBattery-0 (id=5308515)  43%; discharging; (no estimate) present: true
   *
   * @return {Promise<any>}
   */
  static getBatteryStateFromMacOs() {
    return new Promise((resolve, reject) => {
      // Fire off the macOs command to get Battery state
      execSh("pmset -g batt", true, function(err, stdout, stderr) {
        // Oops. Error, so reject with it.
        if (err) {
          reject(stderr);
          return;
        }
        // No error, process the stdout
        const stdOutLines = stdout.split('\n');
        // Resolve with the "last line" removed since that's always empty
        resolve(stdOutLines.splice(0, stdOutLines.length - 1));
      });
    });
  }

  /**
   * Uses macOS version to decide if we can support the particular OS.
   */
  static supportedOs() {
    if (!(macosVersion.isMacOS && macosVersion.is('>10.11'))) {
      return 'Unsupported OS. Must run on macOS 10.11 or newer.';
    }
    return null;
  }

}
