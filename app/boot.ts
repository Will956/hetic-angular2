import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './components/app.component';
import {httpService} from './services/http.service';
import {HTTP_PROVIDERS} from 'angular2/http';
import 'rxjs/add/operator/map';

bootstrap(AppComponent, [HTTP_PROVIDERS, httpService]);
