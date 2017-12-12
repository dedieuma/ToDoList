import {Component, Input, OnInit} from '@angular/core';
import {TodoListService} from "./todo-list.service";
import {Router} from "@angular/router";
import "rxjs/add/operator/filter";
import {PassportUser} from "../data/protocol";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @Input() title = 'ToDoList';

  constructor(private tdlService: TodoListService,
              private router: Router) {
  }

  getUser(): PassportUser {
    return this.tdlService.getUser();
  }

  getUserProvider(): string {
    return this.getUser().provider;
  }

  getUserName(): string {
    return this.getUser().name;
  }

  getUserMail(): string {
    const emails = this.getUser().emails;
    return emails ? emails[0] : "";
  }

  getUserPhoto(): string {
    const photos = this.getUser().photos;
    return photos ? photos[0] : "";
  }

  getConnected() {
    return this.tdlService.getConnected();
  }

  tryReconnectSocket() {
    this.tdlService.tryReconnectSocket();
  }

  ngOnInit() {
    this.router.navigate(["lists"]);
  }
}
