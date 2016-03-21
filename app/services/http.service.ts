import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class httpService {
	constructor(private http:Http) { }

	getPlayerSummaries(id, apiKey) {
	return this.http.get('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + apiKey + '&steamids=' + id)
		.map(response => response.json());
	}

	getFriendList(id, apiKey) {
	return this.http.get('http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=' + apiKey + '&steamid=' + id + '&relationship=friend')
		.map(response => response.json());
	}

	getOwnedGames(id, apiKey) {
	return this.http.get('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + apiKey + '&steamid=' + id + '&include_appinfo=1&format=json')
		.map(response => response.json());
	}




}