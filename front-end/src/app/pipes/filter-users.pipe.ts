// Crea un file chiamato filter.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterUsers implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();

    return items.filter((item) => {
      return (
        item.nome.toLowerCase().includes(searchText) ||
        item.cognome.toLowerCase().includes(searchText) ||
        item.username.toLowerCase().includes(searchText) ||
        item.email.toLowerCase().includes(searchText)
      );
    });
  }
}
