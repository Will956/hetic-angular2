import {Component, View} from 'angular2/core';
import {httpService} from '../services/http.service';
import {Observable} from 'rxjs/Rx';
import _ from 'underscore';

@Component({
    selector: 'steam-app'
})
@View({
	templateUrl: 'app/templates/home.html'
})
export class AppComponent {
	public datas_error: Boolean = false;
	public show_datas: Boolean = false;
	public apiKey: string;
	public player1: Array<Object>;
	public player2: Array<Object>;
	public player1Friends: Array<Object>;
	public player2Friends: Array<Object>;
	public player1FriendsTotal: number = 0;
	public player2FriendsTotal: number = 0;
	public player1Games: Array<Object>;
	public player2Games: Array<Object>;
	public player1GamesTotal: number;
	public player2GamesTotal: number;
	public sameFriends: Array<Object> = [];
	public sameFriendsTotal: number;
	public sameGames: Array<Object> = [];
	public sameGamesTotal: number;
	public sameAchievements: Array<Object> = [];
	public sameAchievementsTotal: number;
	public pointPlayers: number = 0;

	constructor(private _httpService: httpService) {
		this.apiKey = '385FE91CF75CF3037427EBB2CE96D5BF';
	}

	compare(first_id: number, second_id: number) {
		this.show_datas = true;
		this.player1Friends = 0;
		this.player2Friends = 0;
		this.sameGames = [];
		this.sameGamesTotal = 0;
		this.sameFriends = [];
		this.sameFriendsTotal = 0;
		this.pointPlayers = 0;

		// Get Player Summaries
		Observable.forkJoin(
			this._httpService.getPlayerSummaries(first_id, this.apiKey),
			this._httpService.getPlayerSummaries(second_id, this.apiKey)
		).subscribe(
			data => {
				this.player1 = data[0].response.players;
				this.player2 = data[1].response.players;
			},
			err => console.error(err)
		);

		//  Get Friend List
		Observable.forkJoin(
			this._httpService.getFriendList(first_id, this.apiKey),
			this._httpService.getFriendList(second_id, this.apiKey)
		).subscribe(
			data => {
				var friendPlayer1: Array<number> = [];
				var friendPlayer2: Array<number> = [];
				var points: number;
				var self = this;

				this.player1Friends = data[0].friendslist.friends;
				this.player2Friends = data[1].friendslist.friends;

				_.each(this.player1Friends, function(friend) {
					friendPlayer1.push(friend.steamid);
				});

				_.each(this.player2Friends, function(friend) {
					friendPlayer2.push(friend.steamid);
				});

				var intersection: Array<Object> = _.intersection(friendPlayer1, friendPlayer2);

				_.each(intersection, function(steamid) {
					self.sameFriends.push(_.find(self.player1Friends, function(friend) {
						return friend.steamid === steamid;
					}));
				});

				this.sameFriendsTotal = this.sameFriends.length;

				points = Math.floor(this.sameFriendsTotal/15);
				this.pointPlayers += points*10;

				_.each(this.sameFriends, function(friend){
					self._httpService.getPlayerSummaries(friend.steamid, self.apiKey).subscribe(
						data => {
							friend.name = data.response.players[0].personaname;
							friend.avatarfull = data.response.players[0].avatarfull;
					 	},
						err => {console.error(err) }
						);
				});
			
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
				var tabPlayer1: Array<string> = [];
				var tabPlayer2: Array<string> = [];
				var self = this;

				this.player1Games = data[0].response.games;
				this.player2Games = data[1].response.games;

				_.each(this.player1Games, function(game) {
					tabPlayer1.push(game.name);
				});

				_.each(this.player2Games, function(game) {
					tabPlayer2.push(game.name);
				});

				var intersection: Array<Object> = _.intersection(tabPlayer1, tabPlayer2);

				_.each(intersection, function(name) {
					self.sameGames.push(_.find(self.player1Games, function(game) {
						return game.name === name;
					}));
				});

				this.sameGamesTotal = this.sameGames.length;
				this.pointPlayers += this.sameGamesTotal;

				this.player1GamesTotal = data[0].response.game_count;
				this.player2GamesTotal = data[1].response.game_count;
			},
			err => console.error(err)
		);

	}


}