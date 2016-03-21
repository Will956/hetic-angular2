import {Component, View} from 'angular2/core';
import {httpService} from '../services/http.service';
import {Observable} from 'rxjs/Rx';

@Component({
    selector: 'my-app'
})
@View({
	templateUrl: 'app/templates/app.html'
})
export class AppComponent {
	public msg = 'Request result';
	public datas_error: Boolean = false;
	public apiKey;
	public player1;
	public player2;
	public player1Friends;
	public player2Friends;
	public player1FriendsTotal;
	public player2FriendsTotal;
	public player1Games;
	public player2Games;
	public player1GamesTotal;
	public player2GamesTotal;

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
				//console.log(this.player1Friends);
			},
			err => { this.datas_error = true }
			);
		this._httpService.getFriendList(second_id, this.apiKey).subscribe(
			data => { 
				this.player2Friends = data.friendslist.friends;
				this.player2FriendsTotal = data.friendslist.friends.length;
				//console.log(this.player2Friends);
			},
			err => { this.datas_error = true }
			);

		// Get Owned Games
		Observable.forkJoin(
			this._httpService.getOwnedGames(first_id, this.apiKey),
			this._httpService.getOwnedGames(second_id, this.apiKey)
		).subscribe(
			data => {
				this.player1Games = data[0].response.games;
				this.player2Games = data[1].response.games;

				this.player1GamesTotal = data[0].response.game_count;
				this.player2GamesTotal = data[1].response.game_count;

				console.log('1', this.player1Games);
				console.log('2', this.player2Games);
			},
			err => console.error(err)
		);

	}


}