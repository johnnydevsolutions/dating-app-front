import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { MembersService } from '../services/members.service';
import { Members } from '../models/members';

@Injectable({
  providedIn: 'root'
})
export class MemberDetailsResolver implements Resolve<Members> {

  constructor(private memberService: MembersService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Members> {
    return this.memberService.getMember(route.paramMap.get('username')!)
  }
}
