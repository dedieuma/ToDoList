import { Component, OnInit } from '@angular/core';
import {TodoListWithItems, TodoListJSON, TodoListService, ItemJSON} from "../todo-list.service";
import {List} from "immutable";
import {dataForListWithItems, ListID} from "../../data/protocol";

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  lists = List<TodoListJSON>();
  private currentList: TodoListWithItems = undefined;
  private add = false;
  private isDisplaying = {
    isDisplayingTitle: true,
    isDisplayingDesciption: true,
    isDisplayingDeleteButton: false
};
 private listToModify: TodoListWithItems = undefined;

  constructor(private todoListService: TodoListService) {
  }

  ngOnInit() {
  }


  findListChecked(list: TodoListWithItems){
    return list.data.checked === true;
  }

  sortByNameAsc(a, b){
    const x = a.name
    const y = b.name;
    console.log("Parsing NameAsc: "+x+" --- "+y);
    if(y > x)return 1;
    if(x < y) return -1;

    return 0;
  }

  sortByNameDesc(a, b){
    const x = a.name
    const y = b.name;
    console.log("Parsing NameDesc: "+x+" --- "+y);
    if(y > x)return -1;
    if(x < y) return 1;

    return 0;
  }

  getLists(): TodoListWithItems[] {
    const allList = this.todoListService.getLists();
    /*for(const list in allList){
      this.check(allList[list], false);
    }*/
    // Déclenche une erreur si il y a une liste qui a déjà un checked = true au moment du chargement de la page
      this.isDisplaying.isDisplayingDeleteButton = allList.find(this.findListChecked) !== undefined;
    return allList;
  }

  createList(name: string, desc: string) {

    if (this.getLists().find(L => L.name === name)){
      alert("La liste " + name + " existe déjà !");
      return;
    }


     if (name.length < 1){
     alert("Le nom de la liste doit avoir au moins un caractère");
     return;
     }


    const data: dataForListWithItems = {
      description: desc,
      checked: false
    };
    this.todoListService.SERVER_CREATE_NEW_LIST(name, data);
  }

  shouldAllListsBeDisplayed(): boolean {
    return this.currentList === undefined;
  }

  setCurrentListFromId(id?: string) {
    this.currentList = this.getLists().find( L => L.id === id ) || undefined;
  }

  getCurrentList(): TodoListWithItems {
    return this.currentList;
  }
/*
  setCurrentListName(name: string) {
    this.todoListService.SERVER_SET_CURRENT_LIST_NAME(name);
  }
*/
  getCurrentListName(): string {
    return this.currentList ? this.currentList.name : "TodoLists";
  }

  setListToModify(list?: TodoListWithItems){
    this.listToModify = list || undefined;

  }

  getListToModify(){
    return this.listToModify;
  }

  getCurrentListDescription(): string {
    return this.getCurrentList() ? this.currentList.data.description : "";
  }

  modifyList(newName: string, newDescription: string, list?: TodoListWithItems): void {
    const listToModify = (list !== undefined ? list : this.listToModify);


    //newName = newName === "" ? listToModify.name : newName;
    for(const nameLists of this.getLists()){
      if(nameLists.name === newName && nameLists !== listToModify){
        alert("La liste "+newName+" existe déjà.");
        return;
      }
    }
    newName = newName === "" ? listToModify.name : newName;
    newDescription = newDescription === "" ? listToModify.data.description : newDescription;
    const data: dataForListWithItems = { description: newDescription, checked: listToModify.data.checked};

    this.getLists().find( L => L.id === listToModify.id).name = newName;
    this.getLists().find( L => L.id === listToModify.id).data.description = newDescription;
    this.todoListService.SERVER_UPDATE_LIST_NAME(listToModify.id, newName);
    this.todoListService.SERVER_UPDATE_LIST_DATA(listToModify.id, data);


  }

  delete(list: TodoListJSON) {
    if (confirm(`Etes-vous sur de vouloir supprimer la liste ${list.name}?`)) {
      this.todoListService.SERVER_DELETE_LIST(list.id);
    }
  }

  deleteMultipleLists(){
    if(confirm("Voulez-vous supprimer toutes les listes cochées ?")){
      const allLists = this.getLists();
      for(const list in allLists){
        if(allLists[list].data.checked === true){
          this.todoListService.SERVER_DELETE_LIST(allLists[list].id);
        }
      }
    }

  }

  listDescriptionIsNotEmpty(list: TodoListWithItems): boolean {
    return list.data.description !== undefined && list.data.description !== "";
  }

  IsDisplayingTitle(): boolean {
    return this.isDisplaying.isDisplayingTitle;
  }

  changeDisplayTitle(choice?: boolean): void {
    if (this.currentList === undefined && choice !== undefined){
      this.isDisplaying.isDisplayingTitle = choice;
    }else {
      if (this.currentList === undefined) {return; }
      this.isDisplaying.isDisplayingTitle = !this.isDisplaying.isDisplayingTitle;
    }
  }

  setTitle(title: string): void {
    this.changeDisplayTitle();
    this.currentList.name = title;
    this.todoListService.SERVER_UPDATE_LIST_NAME(this.currentList.id, title);

  }

  IsDisplayingDescription(): boolean {
    return this.isDisplaying.isDisplayingDesciption;
  }

  changeDisplayDescription(choice?: boolean): void {
    if (this.currentList === undefined && choice !== undefined){
      this.isDisplaying.isDisplayingDesciption = choice;
    }else {
      if (this.currentList === undefined) {return; }
      this.isDisplaying.isDisplayingDesciption = !this.isDisplaying.isDisplayingDesciption;
    }
  }

  setDescription(description: string): void {
    this.changeDisplayDescription();
    this.currentList.data.description = description;
    const data : dataForListWithItems = {
      description : description,
      checked : this.currentList.data.checked
    };
    this.todoListService.SERVER_UPDATE_LIST_DATA(this.currentList.id, data);
  }

  IsDisplayingDeleteButton(){
    return this.isDisplaying.isDisplayingDeleteButton;
  }

  changeDisplayDeleteButton(bo : boolean){
    this.isDisplaying.isDisplayingDeleteButton = bo;
  }


duplicate(list: TodoListWithItems): void {
  this.createList(list.name+" (1)", list.data.description);
  const idOfTheEmptyList = this.getLists().find( L => L.name === (list.name+" (1)")).id;
  for(const item of list.items){
    this.todoListService.SERVER_CREATE_ITEM(idOfTheEmptyList, item.label, item.checked, item.data);
  }

}

  check(list: TodoListWithItems, checked: boolean) {
    const data: dataForListWithItems = {
      description: list.data.description,
      checked: checked
    }
    this.todoListService.SERVER_UPDATE_LIST_DATA(list.id, data);

    if(checked === true){
      this.isDisplaying.isDisplayingDeleteButton = true;

    }else if(checked === false && this.getLists().find(this.findListChecked) === undefined){
      this.isDisplaying.isDisplayingDeleteButton = false;
    }
  }



}
