import { Component, AfterViewInit, ViewChild, ElementRef, EventEmitter, Input, Output } from "@angular/core";
import { createPopper } from "@popperjs/core";
import { iItemsDropdown } from "src/app/models/items-dropdown";

@Component({
  selector: "app-table-dropdown",
  templateUrl: "./table-dropdown.component.html",
})
export class TableDropdownComponent implements AfterViewInit {
  dropdownPopoverShow = false;
  @ViewChild("btnDropdownRef", { static: false }) btnDropdownRef: ElementRef;
  @ViewChild("popoverDropdownRef", { static: false })
  popoverDropdownRef: ElementRef;
  @Input() items:iItemsDropdown[] = []
  @Input() id:any
  @Output() goTo = new EventEmitter<any>()

  ngAfterViewInit() {

    console.log('items-->',this.items)

    createPopper(
      this.btnDropdownRef.nativeElement,
      this.popoverDropdownRef.nativeElement,
      {
        placement: "bottom-start",
      }
    );
  }
  toggleDropdown(event) {
    event.preventDefault();
    if (this.dropdownPopoverShow) {
      this.dropdownPopoverShow = false;
    } else {
      this.dropdownPopoverShow = true;
    }
  }

  emmitEventChildrem(event:string,){
    this.goTo.emit({event,id:this.id})
  }
}
