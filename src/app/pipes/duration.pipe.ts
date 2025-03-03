import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  transform(value: string): string {
    let returnValue = '';
    let [hour, minutes] = value.split(':');
    if (hour !== '0') {
      if (hour === '1') {
        returnValue = '1 Stunde';
      } else {
        returnValue = hour + ' Stunden';
      }
    } else if (minutes === '01') {
      returnValue = '1 Minute';
    } else returnValue = minutes + ' Minuten';
    if (hour !== '0' && minutes === '01') {
      returnValue += ' 1 Minute';
    } else if (hour !== '0' && minutes !== '01' && minutes !== '00')
      returnValue += ' ' + minutes + ' Minuten';
    return returnValue;
  }
}
