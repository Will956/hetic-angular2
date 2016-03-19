import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class httpService {

  constructor(private http:Http) { }

  getDatas() {
	return this.http.get('http://jsonplaceholder.typicode.com/posts')
    	.map(response => response.json());
  }


}