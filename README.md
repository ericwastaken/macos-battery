# macos-battery

> When running on macOs, gets the battery charge percentage and battery charge status.


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

// Possible Returns:
//=> Battery charge can't be determined. Possibly running on a device with no battery.
//=> Battery charge is 100%.

macOsBattery.getBatteryChargeState()
    .then(batteryState => {
      console.log(`Battery charge state is '${batteryState}'.`)
    }).catch(err => {
  console.log(`error: ${err}.`);
});

// Possible Returns:
//=> Battery charge state is 'charged'.
//=> Battery charge state is 'discharging'.
//=> Battery charge state is 'charging'.
//=> Battery charge state is 'finishing charge'.

     
```


## API

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

## License

MIT © [Eric A. Soto](https://ericsoto.net/)
