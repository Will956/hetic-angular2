import {Component, View, EventEmitter} from 'angular2/core';
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
		this.apiKey = '385FE91CF75CF3037427EBB2CE96D5BF';
	}

	compare(first_id, second_id) {
		console.log(this);

		// Get Player Summaries
		this._httpService.getPlayerSummaries(first_id, this.apiKey).subscribe(
			data => { this.player1 = data.response.players; console.log(this.player1); },
			err => { this.datas_error = true }
			);
		this._httpService.getPlayerSummaries(second_id, this.apiKey).subscribe(
			data => { this.player2 = data.response.players; console.log(this.player2); },
			err => { this.datas_error = true }
			);

		//  Get Frield List
		this._httpService.getFriendList(first_id, this.apiKey).subscribe(
			data => { 
				this.player1Friends = data.friendslist.friends;
				this.player1FriendsTotal = data.friendslist.friends.length;
				console.log(this.player1Friends);
			},
			err => { this.datas_error = true }
			);
		this._httpService.getFriendList(second_id, this.apiKey).subscribe(
			data => { 
				this.player2Friends = data.friendslist.friends;
				this.player2FriendsTotal = data.friendslist.friends.length;
				console.log(this.player2Friends);
			},
			err => { this.datas_error = true }
			);

		// Get Owned Games
		this._httpService.getOwnedGames(first_id, this.apiKey).subscribe(
			data => { 
				this.player1Games = data.response.games;
				this.player1GamesTotal = data.response.game_count;
				console.log(this.player1Games);
			},
			err => { this.datas_error = true }
			);
		this._httpService.getOwnedGames(second_id, this.apiKey).subscribe(
			data => { 
				this.player2Games = data.response.games;
				this.player2GamesTotal = data.response.game_count;
				console.log(this.player2Games);
			},
			err => { this.datas_error = true }
			);
	}


}