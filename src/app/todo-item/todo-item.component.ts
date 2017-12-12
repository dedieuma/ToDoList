import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ListID, ItemJSON, TodoListService} from "../todo-list.service";
import {dataForItem} from "../../data/protocol";

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent implements OnInit, OnChanges {
  @Input() item: ItemJSON;
  @Input() listId: ListID;
  @Input() clock: number;
  private editingLabel = false;


  constructor(private todoListService: TodoListService) { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
  }

  getParticipant(): string {
    return this.item.data.participants.join(", ") || "aucun participant";
  }

  getListFromIDList() {
    return this.todoListService.getLists().find(L => L.id === this.listId);
  }

  getDate(): string {
    return this.item.data.dateI || "aucune date";
  }

  getCompteRebours() : string {
    const newDate1 = new Date(this.item.data.dateI);
    const newDate2 = new Date(Date.now());
    const diff = newDate1.getTime() - newDate2.getTime();
    const dif_days = Math.ceil(diff / (1000 * 3600 * 24));
    if (dif_days > 0){
      return "Jours restants :" + dif_days.toString();
    } else if (dif_days < 0) {
      return "Date dépassée de " + Math.abs(dif_days).toString() + " jours";
    } else if (dif_days === 0){
      return "Date Limite Aujourd'hui !";
    } else {
      return "";
    }
  }

  setLabel(label: string) {
    if (label === "") {
      this.delete();
    } else {
      this.todoListService.SERVER_UPDATE_ITEM_LABEL(this.listId, this.item.id, label);
    }
    this.editLabel();
  }

  setItem(label: string, participants: string, dateI: string, compte : string) {
    this.setLabel(label);
    const participantsArray = participants.split(", ");
    const data: dataForItem = {
      participants : participantsArray,
      dateI : dateI,
      couleur: ''

    };
    this.todoListService.SERVER_UPDATE_ITEM_DATA(this.listId, this.item.id, data);

  }

  isEditingLabel(): boolean {
    return this.editingLabel;
  }

  editLabel() {
    this.editingLabel = !this.editingLabel;
  }

  check(checked: boolean) {
    this.todoListService.SERVER_UPDATE_ITEM_CHECK(this.listId, this.item.id, checked);
  }

  delete() {
      if (confirm("Etes-vous sur de vouloir supprimer l'item "+this.item.label+" ?")) {
        this.todoListService.SERVER_DELETE_ITEM(this.listId, this.item.id);
      }

  }

  modifier() {
    this.todoListService.SERVER_UPDATE_LIST_DATA(this.listId, this.item.id);
  }
  getColor(): string{
    return this.item.data.couleur;
  }

  setColor(couleur: string){
    if(this.item.data.couleur === couleur){
      this.item.data.couleur = '';
    } else {
      this.item.data.couleur = couleur;

    }

    const data: dataForItem = this.item.data;
    data.couleur = this.item.data.couleur;

    this.todoListService.SERVER_UPDATE_ITEM_DATA(this.listId, this.item.id, data);
  }

  liftItem() {
    const list = this.getListFromIDList();
    const index = list.items.indexOf(this.item);
    if (index <= 0) {
      return;
    }
    const tmpItem = list.items[index];
    list.items[index] = list.items[index-1];
    list.items[index-1] = tmpItem;


  }

  dropItem() {
    const list = this.getListFromIDList();
    const index = list.items.indexOf(this.item);
    if (index >= list.items.length-1) {
      return;
    }
    const tmpItem = list.items[index];
    list.items[index] = list.items[index+1];
    list.items[index+1] = tmpItem;

  }


}
