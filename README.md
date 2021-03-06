# macos-battery

> When running on a macOs device with a battery, gets the battery charge percentage and battery charge status.


## Install

```
$ npm install --save macos-battery
```


## Example Use

```js
const macOsBattery = require('macos-battery');

macOsBattery.getBatteryChargePercent()
  .then(batteryPercent => {
    if (batteryPercent != -1) {
      console.log(`Battery charge is ${batteryPercent}%.`)
    } else {
      console.log(`Battery charge can't be determined. Possibly running on a device with no battery.`)
    }
  }).catch(err => {
    console.log(`error: ${err}.`);
  });

// Example Return Values:
//=> Battery charge can't be determined. Possibly running on a device with no battery.
//=> Battery charge is 100%.

macOsBattery.getBatteryChargeState()
    .then(batteryState => {
      console.log(`Battery charge state is '${batteryState}'.`)
    }).catch(err => {
  console.log(`error: ${err}.`);
});

// Example Return Values:
//=> Battery charge state is 'charged'.
//=> Battery charge state is 'discharging'.
//=> Battery charge state is 'charging'.
//=> Battery charge state is 'finishing charge'.
//=> Battery charge state is 'no battery'.
//=> Battery charge state is 'undetermined'.

macOsBattery.getBatteryStateObject()
    .then(batteryState => {
      console.log(`Battery charge is '${batteryState.percent}'.`);
      console.log(`Battery charge state is '${batteryState.state}'.`);
    }).catch(err => {
  console.log(`error: ${err}.`);
});

// Returns the same as the two above APIs but in a single call.
```

## Requirements

This package supports macOS 10.11 or newer. Please report if this works on older versions of macOS via issues so that we can upate the requirements check.

## Limitations

At present, the API returns status of the primary device's battery. Are there Macs with multiple batteries? Open an issue and let us know!

## API

This package is non-blocking and returns promises.

### getBatteryChargePercent()

Returns a promise that resolves to an integer representing the battery charge percent. If no battery is present or the value can't be determined, this will resolve to -1.

This method can reject with an error.

### getBatteryChargeState()

Returns a promise that resolves to a string with any of the following:
- charged
- charging
- discharging
- finishing charge
- no battery
- undetermined

This method can reject with an error.

### getBatteryStateObject()

Returns a promise that resolves to an object with both charge state and percent:
```json
{
  "percent": 99,
  "state": "charged"
}
```

## Under the Hood

This package uses macOs's `pmset -g batt` command to get status from the OS. However, the output is processed to safely meet the needs of the exposed API.

## License

MIT © [Eric A. Soto](https://ericsoto.net/)
