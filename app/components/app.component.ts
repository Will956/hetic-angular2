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
	public sameGames = [];

	constructor(private _httpService: httpService) {
		this.apiKey = '385FE91CF75CF3037427EBB2CE96D5BF';
	}

	compare(first_id, second_id) {
		// Get Player Summaries
		Observable.forkJoin(
			this._httpService.getPlayerSummaries(first_id, this.apiKey)
			this._httpService.getPlayerSummaries(second_id, this.apiKey)
		).subscribe(
			data => {
				this.player1 = data[0].response.players;
				this.player2 = data[1].response.players;
			},
			err => console.error(err)
		);

		//  Get Frield List
		Observable.forkJoin(
			this._httpService.getFriendList(first_id, this.apiKey),
			this._httpService.getFriendList(second_id, this.apiKey)
		).subscribe(
			data => {
				this.player1Friends = data[0].friendslist.friends;
				this.player2Friends = data[1].friendslist.friends;
				
				this.player1FriendsTotal = this.player1Friends.length;
				this.player2FriendsTotal = this.player2Friends.length;
			},
			err => console.error(err)
		);

		// Get Owned Games
		Observable.forkJoin(
			this._httpService.getOwnedGames(first_id, this.apiKey),
			this._httpService.getOwnedGames(second_id, this.apiKey)
		).subscribe(
			data => {
				var tabPlayer1 = [];
				var tabPlayer2 = [];
				var self = this;

				this.player1Games = data[0].response.games;
				this.player2Games = data[1].response.games;

				_.each(this.player1Games, function(game) {
					tabPlayer1.push(game.name);
				});

				_.each(this.player2Games, function(game) {
					tabPlayer2.push(game.name);
				});

				var intersection = _.intersection(tabPlayer1, tabPlayer2);

				_.each(intersection, function(name) {
					self.sameGames.push(_.find(self.player1Games, function(game) {
						return game.name === name;
					}));
				});

				this.player1GamesTotal = data[0].response.game_count;
				this.player2GamesTotal = data[1].response.game_count;
			},
			err => console.error(err)
		);

	}


}