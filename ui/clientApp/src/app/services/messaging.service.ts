import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs'; //take

@Injectable()
export class MessagingService {

    messaging;

    currentMessage = new BehaviorSubject<any>(null);

    constructor() {}   

    getPermission() {
    }

    receiveMessage() {
        
    }
}