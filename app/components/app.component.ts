import {Component, View} from 'angular2/core';
import {httpService} from '../services/http.service';

@Component({
    selector: 'my-app'
})
@View({
	templateUrl: 'app/templates/app.html'
})
export class AppComponent {
	public msg = 'Request result';
	public datas_error: Boolean = false;

	constructor(private _httpService: httpService) {
		this._httpService.getDatas().subscribe(
			data => { this.datas = data },
			err => { this.datas_error = true }
			);
	}


}