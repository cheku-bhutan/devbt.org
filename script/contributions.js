const base_url = "https://api.github.com";

function httpGet(theUrl, return_headers) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", theUrl, false); // false for synchronous request
	xmlHttp.send(null);
	if (return_headers) {
		return xmlHttp;
	}
	return xmlHttp.responseText;
}

function get_all_commits_count(owner, repo, sha) {
	nameList = [];
	avatarList = [];
	usernameList = [];
	commitCount = [];

	let first_commit = get_first_commit(owner, repo);
	let compare_url =
		base_url +
		"/repos/" +
		owner +
		"/" +
		repo +
		"/compare/" +
		first_commit +
		"..." +
		sha;

	let commit_req = httpGet(compare_url);
	var jsonData = JSON.parse(commit_req);

	for (var i in jsonData.commits) {
		let login = "BTDeveloperCommunity";
		let url = "https://avatars.githubusercontent.com/u/96703040?s=200&v=4";
		nameList.push(jsonData.commits[i].commit.author.name);
		if (jsonData.commits[i].author) {
			usernameList.push(jsonData.commits[i].author.login);
			avatarList.push(jsonData.commits[i].author.avatar_url);
		} else {
			usernameList.push(login);
			avatarList.push(url);
		}
		commitCount.push(1);
	}

	const tempObj = {};
	nameList.forEach((person) => {
		tempObj[person] = tempObj[person] ? (tempObj[person] += 1) : 1;
	});

	// const output = arr1.map((el, i) => ({ index: el, value: arr2[i] }));

	const data = nameList.map((element, i) => ({
		commiterName: element,
		username: usernameList[i],
		avatar: avatarList[i],
		commitCount: 1,
	}));

	console.log(tempObj);

	return data;
}

function get_first_commit(owner, repo) {
	let url = base_url + "/repos/" + owner + "/" + repo + "/commits";
	let req = httpGet(url, true);
	let first_commit_hash = "";
	if (req.getResponseHeader("Link")) {
		let page_url = req
			.getResponseHeader("Link")
			.split(",")[1]
			.split(";")[0]
			.split("<")[1]
			.split(">")[0];
		let req_last_commit = httpGet(page_url);
		let first_commit = JSON.parse(req_last_commit);
		first_commit_hash = first_commit[first_commit.length - 1]["sha"];
	} else {
		let first_commit = JSON.parse(req.responseText);
		first_commit_hash = first_commit[first_commit.length - 1]["sha"];
	}
	return first_commit_hash;
}

// declaring GitHub account username and branch
let owner = "BTDeveloperCommunity";
let sha = "main";

// object consisting of commiter name, GitHub username, and GitHub Avatar URL for 3 repos in the organization account
const devbtorg = get_all_commits_count(owner, "devbt.org", sha);
const commGuidelines = get_all_commits_count(
	owner,
	"btn-community-guidelines",
	sha
);
const profileReadme = get_all_commits_count(owner, "BTDeveloperCommunity", sha);

console.log(commGuidelines);
const arr = [];
Object.keys(commGuidelines).forEach((key) =>
	arr.push({
		slNo: key,
		commiterName: element,
		username: usernameList[key],
		avatar: avatarList[key],
		commitCount: commitCount[key],
	})
);

console.log(arr);
