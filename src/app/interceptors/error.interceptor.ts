import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router,
              private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error) {
          switch (error.status) {
            case 400:
              const errorBadRequest = "Bad Request";
              if (error.error.errors) {
                const modalStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modalStateErrors.push(error.error.errors[key]);
                  }
                }
                for (const error of modalStateErrors) {
                  this.toastr.error(error, error.status.toString());
                }
                throw modalStateErrors.flat();
              } else {
                this.toastr.error(errorBadRequest, error.error.statusCode);
              }
              break;


              case 401:
                case 401:
                const errorMsg = "Unauthorized";
                this.toastr.error(errorMsg, error.status.toString());
                break;

              case 404:
                const errorNotFound = "Not Found"
                this.toastr.error(errorNotFound, error.status.toString());
                this.router.navigateByUrl('/not-found');
                break;

                case 500:
                  const navigationExtras: NavigationExtras = {state: {error: error.error}};
                  const errorInternalServer = "Internal Server Error";
                  this.toastr.error(errorInternalServer, error.status.toString());
                  this.router.navigateByUrl('/server-error', navigationExtras);
                  break;
                }

        }
        return throwError(error);
      }
      )
      )
    }


  }
