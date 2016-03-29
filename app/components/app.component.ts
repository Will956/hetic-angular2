import {Component, View} from 'angular2/core';
import {httpService} from '../services/http.service';
import {Observable} from 'rxjs/Rx';
import * as _ from 'underscore';

@Component({
    selector: 'steam-app'
})
@View({
	templateUrl: 'app/templates/home.html'
})
export class AppComponent {
	public msg: string = 'Request result';
	public datas_error: Boolean = false;
	public show_datas: Boolean = false;
	public apiKey: string;
	public player1: Array[];
	public player2: string;
	public player1Friends;
	public player2Friends;
	public player1FriendsTotal;
	public player2FriendsTotal;
	public player1Games;
	public player2Games;
	public player1GamesTotal;
	public player2GamesTotal;
	public sameFriends = [];
	public sameFriendsTotal;
	public sameGames = [];
	public sameGamesTotal;
	public player1Achivements = [];
	public player2Achivements = [];
	public sameAchievements = [];
	public sameAchievementsTotal;

	constructor(private _httpService: httpService) {
		this.apiKey = '385FE91CF75CF3037427EBB2CE96D5BF';
	}

	compare(first_id, second_id) {
		this.show_datas = true;

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

		//  Get Frield List
		Observable.forkJoin(
			this._httpService.getFriendList(first_id, this.apiKey),
			this._httpService.getFriendList(second_id, this.apiKey)
		).subscribe(
			data => {
				var friendPlayer1 = [];
				var friendPlayer2 = [];
				var self = this;

				this.player1Friends = data[0].friendslist.friends;
				this.player2Friends = data[1].friendslist.friends;

				_.each(this.player1Friends, function(friend) {
					friendPlayer1.push(friend.steamid);
				});

				_.each(this.player2Friends, function(friend) {
					friendPlayer2.push(friend.steamid);
				});

				var intersection = _.intersection(friendPlayer1, friendPlayer2);

				_.each(intersection, function(steamid) {
					self.sameFriends.push(_.find(self.player1Friends, function(friend) {
						return friend.steamid === steamid;
					}));
				});

				this.sameFriendsTotal = this.sameFriends.length;

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
				var tabPlayer1 = [];
				var tabPlayer2 = [];
				var tabAchiev1 = [];
				var tabAchiev2 = [];
				var self = this;

				this.player1Games = data[0].response.games;
				this.player2Games = data[1].response.games;

				_.each(this.player1Games, function(game) {
					tabPlayer1.push(game.name);
					self._httpService.GetPlayerAchievements(first_id, self.apiKey, game.appid)
						.subscribe(
							data => {
								_.each(data.playerstats.achievements, function(achievement) {
									if(achievement.achieved === 1) {
										self.player1Achivements.push(achievement);
									}
								});
							},
							err => {}
							);
				});

				_.each(this.player2Games, function(game) {
					tabPlayer2.push(game.name);
					self._httpService.GetPlayerAchievements(second_id, self.apiKey, game.appid)
						.subscribe(
							data => {
								_.each(data.playerstats.achievements, function(achievement) {
									if(achievement.achieved === 1) {
										self.player2Achivements.push(achievement);
									}
								});
							},
							err => {}
							);
				});

				_.each(this.player1Achivements, function(achievement) {
					tabAchiev1.push(achievement.apiname);
				});
				_.each(this.player2Achivements, function(achievement) {
					tabAchiev2.push(achievement.apiname);
				});

				var interAchiev = _.intersection(tabAchiev1, tabAchiev2);

				_.each(interAchiev, function(apiname) {
					self.sameAchievements.push(_.find(self.player1Achivements, function(achievement) {
						return achievement.apiname === apiname;
					}));
				});

				var intersection = _.intersection(tabPlayer1, tabPlayer2);

				_.each(intersection, function(name) {
					self.sameGames.push(_.find(self.player1Games, function(game) {
						return game.name === name;
					}));
				});

				this.sameGamesTotal = this.sameGames.length;
				this.sameAchievementsTotal = this.sameAchievements.length;

				console.log(this.sameAchievements);

				this.player1GamesTotal = data[0].response.game_count;
				this.player2GamesTotal = data[1].response.game_count;
			},
			err => console.error(err)
		);

	}


}