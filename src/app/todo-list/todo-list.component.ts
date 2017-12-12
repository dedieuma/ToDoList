import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit} from '@angular/core';
import {TodoListWithItems, TodoListService} from "../todo-list.service";
import {stringDistance} from "codelyzer/util/utils";
import { DatePipe } from '@angular/common';
import {forEach} from "@angular/router/src/utils/collection";
import {NUMBER_TYPE} from "@angular/compiler/src/output/output_ast";
import {toNumber} from "ngx-bootstrap/timepicker/timepicker.utils";
import {isNgTemplate} from "@angular/compiler";
@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {
  @Input() list: TodoListWithItems;
  @Input() clock: number;


  constructor(private todoListService: TodoListService , private datePipe: DatePipe) { }

  ngOnInit() {
  }

  createItem(label: string, participants: string, dateI: string) {

    if(label == ""){
      alert("L'item doit avoir un nom.");
    } else {
        const localIdItem = this.todoListService.SERVER_CREATE_ITEM(
          this.list.id,
          label,
          false,
          { participants: participants.split(",").map( P => P.trim()), dateI,couleur:''}
        );

    }

  }

  getColor(): string {
    return this.list.data["color"] ? this.list.data["color"] : "#FFFFFF";
  }

  setColor(color: string) {
    console.log("setColor", color);
    this.todoListService.SERVER_UPDATE_LIST_DATA(
      this.list.id,
      Object.assign({}, this.list.data, {color})
    );
  }

  sortByDateAsc(a,b){
   const x = Date.parse(a.data.dateI);
   const y = Date.parse(b.data.dateI);


   if ( !isFinite(x) && !isFinite((y))) {
     return 0;
   }
   if (!isFinite(x)){
     return 1;
   }
   if (!isFinite(y)){
     return -1;
   }
   console.log("Parsing DateAsc: "+x+" --- "+y);
   return x-y;
  }

  sortByDateDesc(a, b){
    const x = Date.parse(a.data.dateI);
    const y = Date.parse(b.data.dateI);

    if ( !isFinite(x) && !isFinite((y))) {
      return 0;
    }
    if (!isFinite(x)){
      return 1;
    }
    if (!isFinite(y)){
      return -1;
    }
    console.log("Parsing DateDesc: "+x+" --- "+y);
    return y-x;

  }

  sortByNameAsc(a, b){
    const x = a.label;
    const y = b.label;
    console.log("Parsing NameAsc: "+x+" --- "+y);
    if(y > x)return -1;
    if(x < y) return 1;

    return 0;
  }

  sortByNameDesc(a, b){
    const x = a.label;
    const y = b.label;
    console.log("Parsing NameDesc: "+x+" --- "+y);
    if(x < y) return 1;
    if(y > x) return -1;
    return 0;
  }

  deleteCheckedItems(){
    let itemsToDelete = [];
    if(confirm("Voulez-vous supprimer les items cochés ?")){
      let listlength = this.list.items.length;
	  if(listlength==0){
		  alert("Il n'y a aucun item coché...");
	  }
      for(let i = 0; i < listlength; i++){
        const item = this.list.items[i];
        if(item.checked){
          itemsToDelete.push(item);
		    }
	    }
    }

    if (itemsToDelete.length > 0){
      for(let i = 0; i <itemsToDelete.length; i++){
        this.todoListService.SERVER_DELETE_ITEM(this.list.id, itemsToDelete[i].id);
      }
    }
  }


}
