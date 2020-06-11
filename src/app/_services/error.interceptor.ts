import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: import('@angular/common/http').HttpRequest<any>,
    next: import('@angular/common/http').HttpHandler
  ): import('rxjs').Observable<import('@angular/common/http').HttpEvent<any>> {
    return next.handle(req).pipe(
        catchError(httpError => {
            if (httpError.status === 401) {
                return throwError(httpError.statusText);
            }
            if (httpError instanceof HttpErrorResponse) {
                const applicationError = httpError.headers.get('Application-Error');
                if (applicationError) {
                    return throwError(applicationError);
                }

                const serverError = httpError.error;
                let modelStateErrors = '';
                if (serverError.errors && typeof serverError.errors === 'object') {
                    debugger;
                    for (const key in serverError.errors) {
                        if (serverError.errors[key]) {
                            modelStateErrors += serverError.errors[key] + '\n';
                        }
                    }
                }
                return throwError(modelStateErrors || serverError || 'Server Error')
            }
        })
    )
  }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};
