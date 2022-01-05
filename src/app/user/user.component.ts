import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { User, UserService } from '../service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
dataLoaded = false;
listOfAllUsers: Array<User> = [];
filteredListOfUser: Array<User> = [];
listOfRoles: Array<String> = ["WSZYTSKIE"];
dataForms: FormGroup = new FormGroup({});
formChangesSubscription: Subscription | undefined;

  constructor(private userService: UserService, private authService: AuthenticationService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getAllUsers();
  }


  getAllUsers(): void {
    this.dataLoaded = false;
    let numberOfReadyUsers = 0;
    this.userService.getAllUsers().subscribe(users => {
      users?.forEach(user => {
        if(user.isActive){
          user.userStatus = "TAK"
        }else{
          user.userStatus = "NIE"
        }
        if(!this.listOfRoles.includes(user.role)){
          this.listOfRoles.push(user.role);
        }
        this.listOfAllUsers.push(user);
        if (numberOfReadyUsers > users.length - 2) {
          this.prepareForms();
        }
        numberOfReadyUsers++;
      
      });
    this.dataLoaded = true;
    });
  }

  prepareForms(): void {
    this.dataForms = this.fb.group({
      role: [this.listOfRoles[0] || '']
    });

    this.setFormsSubscriptions();
    this.filterUser();
  }

  setFormsSubscriptions(): void {
  
    this.formChangesSubscription = this.dataForms.valueChanges.subscribe(changedValue => {
      this.filterUser();
    })
  }

  unsubscribeForms(): void {
    this.formChangesSubscription?.unsubscribe();
  }

  filterUser(): void {
    if(this.dataForms.get('role')?.value === "WSZYTSKIE"){
      this.filteredListOfUser = this.listOfAllUsers;
    }else{
    this.filteredListOfUser = this.listOfAllUsers.filter(user => {
      return user.role  === this.dataForms.get('role')?.value ;
    });
  }
}

  ngOnDestroy(): void {
    this.unsubscribeForms();
  }
}
