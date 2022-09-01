const VERTICAL_SPACING = 50;
const CHRIS_URL = "https://pbs.twimg.com/profile_images/1543304220379676678/ZGvvOt5a_400x400.jpg";
const TEXT_LEFT_OFFSET = 5;
const NUMBER_OFFSET = 30;
const TEXT_UP_OFFSET = 40;
const AVATAR_SPACING = 130;
const USER_AVATAR_START = 55;
const FRIEND_OFFSET = 150;
const API_ENDPOINT = "https://digitaldouble-api.vercel.app/api/getData?username=";
const SPOT_ENDPOINT = "https://digitaldouble-api.vercel.app/api/checkSlots";

//const API_ENDPOINT = "http://localhost:3001/api/getData?username=";
//const SPOT_ENDPOINT = "http://localhost:3001/api/checkSlots";
const TITLE_FONT = "PressStart";
const CONTENT_FONT = "serif"
const TEXT_WIDTH = 290;
//https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2
//https://fonts.gstatic.com/s/sourcecodepro/v22/HI_diYsKILxRpg3hIP6sJ7fM7PqPMcMnZFqUwX28DMyQtMlrTFcZZJmOpw.woff2
let myFont = new FontFace(
    CONTENT_FONT,
    "url(https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2)"
  );
  myFont.load().then((font) => {
    document.fonts.add(font)
});
let myFont2 = new FontFace(
    TITLE_FONT,
    "url(https://fonts.gstatic.com/s/pressstart2p/v14/e3t4euO8T-267oIAQAu6jDQyK3nVivNm4I81.woff2)"
  );
  myFont2.load().then((font) => {
    document.fonts.add(font)
});
var alt_text = "";
 $(function(){

  $.ajax({
    url: SPOT_ENDPOINT,
    type: 'GET',
    dataType: 'json', // added data type
    success: function(res) {
      if(res['slots_left'] < 1) {
        $('#spot-block')[0].classList.toggle('d-none');
      }
      else {
        $('#username-form')[0].classList.toggle('d-none');
      }
    }
  });
    $('#username-form').submit(function () {
      main();
      return false;
     });
  });

const loadImage = path => {
	return new Promise((resolve, reject) => {
	  const img = new Image()
	  img.crossOrigin = 'Anonymous'
	  img.src = path
	  img.onload = () => {
		resolve(img)
	  }
	  img.onerror = e => {
		reject(e)
	  }
	})
  }

function roundedRect(ctx, x, y, width, height, radius) {
	ctx.beginPath();
	ctx.moveTo(x, y + radius);
	ctx.arcTo(x, y + height, x + radius, y + height, radius);
	ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
	ctx.arcTo(x + width, y, x + width - radius, y, radius);
	ctx.arcTo(x, y, x, y + radius, radius);
	ctx.closePath();
	ctx.fill();
  }


async function drawAvatar(ctx, x, y, width, height, borderRadius, avatar) {
	ctx.fillStyle = '#00FF41';
	ctx.fillRect(x - borderRadius / 2, y - borderRadius / 2, width + borderRadius, height + borderRadius);
	ctx.drawImage(
		avatar,
		x,
		y,
		width,
		height
	);

}

function drawTopBox(ctx, x, y, dict) {
	let list = dict.entity_list;
	ctx.fillStyle = '#00FF41';
	ctx.font = '50px ' + TITLE_FONT;
	ctx.fillText(dict.domain_name.toUpperCase(),x, y, TEXT_WIDTH + NUMBER_OFFSET)
	ctx.font = '40px ' + CONTENT_FONT;
    for(let i = 0; i < list.length; ++i) {
        ctx.fillText((1 + i), x, TEXT_UP_OFFSET + y + i * VERTICAL_SPACING, NUMBER_OFFSET);
    }
    ctx.textAlign = "start";
	for(let i = 0; i < list.length; ++i) {
		ctx.fillText(list[i], x + NUMBER_OFFSET, TEXT_UP_OFFSET + y + i * VERTICAL_SPACING, TEXT_WIDTH);
	}
}

/**
 *
 * @param config is an array with 4 entries
 * Each entry is an object with the following properties:
 * distance: from the middle of the image to the middle of the circle at the current layer. The bigger the number, the further is the layer from the center
 * count: circles in the current layer
 * radius: of the circles in this layer
 * users: list of users to render in the format {avatar:string}
 * @returns {Promise<void>}
 */
async function render(data) {
    var canvas = document.getElementById('responsive-canvas');
    

    const user = data["user"];
    const results = data["results"];
	const top_domains = results["top_domains"];
	const friends = results["top_friends"];
	const width = 1000;
	const height = 1000;
  canvas.width = width;
  canvas.height = height;
	const ctx = canvas.getContext("2d");

	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, width, height);

	const logo = await loadImage('logo.png')
	loc_dicts = [{x:60, y:100},{x:620,y:100},{x:60, y:400},{x:620,y:400},{x:60, y:700},{x:620,y:700}]
	for(let i = 0; i < top_domains.length; ++i)
	{
		drawTopBox(ctx, loc_dicts[i].x, loc_dicts[i].y, top_domains[i]);
	}
	await drawAvatar(ctx, 440, USER_AVATAR_START, 120, 120, 10, await loadImage(user.avatar));
	let friend_images = Promise.all(
		Object.values(friends).map(async p => {
			return await loadImage(p);
		})
	  );
	friend_images = await friend_images;
	for(let i = 0; i < friend_images.length; ++i)
	{
		drawAvatar(ctx, 450, USER_AVATAR_START + FRIEND_OFFSET + AVATAR_SPACING * i, 100, 100, 10, friend_images[i]);
	}
	ctx.font = "30px " + CONTENT_FONT
	ctx.fillText("digitaldouble.irlbook.com", 620, 980);
  convertCanvasToImage();
};

function convertCanvasToImage() {
  var canvas = document.getElementById('responsive-canvas'),
  dataUrl = canvas.toDataURL(),
  imageFoo = document.getElementById('result-image');
  imageFoo.src = dataUrl;
  imageFoo.classList.toggle('d-none');
  imageFoo.classList.toggle('d-block');

}

function downloadImage() {
    var link = document.createElement('a');
    link.download = 'digitaldouble.png';
    link.href = document.getElementById('responsive-canvas').toDataURL()
    link.click();
}


function main() {
    //fetch api either show error or hide form
    var user_form = document.getElementById('username-form');
    //render image
    let username = document.getElementById('username').value;
    if(username === "") return;
    username = username.replace("@", "");
    let error_box = document.getElementById('error');
    document.getElementById('book-info').classList.toggle('d-none');
    user_form.classList.add('d-none');
    error_box.classList.add('d-none');
    let loading_box = document.getElementById('loading');
    loading_box.innerText = `> Fetching tweets for @${username}...`;
    loading_box.classList.toggle('d-none');
    const response = fetch(API_ENDPOINT + username)
        .then(response => validateResponse(response.json()))
        .catch(err => handleError(err));
}

async function validateResponse(data) {
    data = await data;

    if('error' in data)
    {
        handleError(data);
        return;
    }
    consumeData(data);
}

function handleError(err) {
    let error_box = document.getElementById('error');
    error_box.classList.remove('d-none');
    let loading_box = document.getElementById('loading');
    loading_box.classList.add('d-none');
    //expected error
    if('error' in err) {
    error_box.innerText = err['error'];
    }
    else {
      error_box.innerHTML = "Something went wrong.\nPlease DM <a href=\"https://twitter.com/computer_gay\">@computer_gay</a>."
    }
}
function altText() {
  var copyIcon= document.getElementById("copy-span");
  var checkIcon= document.getElementById("check");
  checkIcon.classList.remove('d-none');
  copyIcon.classList.add('d-none');
   /* Copy the text inside the text field */
  navigator.clipboard.writeText(alt_text);
}

async function consumeData(data) {
    await render(data);
    let loading_box = document.getElementById('loading');
    loading_box.classList.toggle('d-none');
    let save_box = document.getElementById('save');
    save_box.classList.toggle('d-none');
    let alt_box = document.getElementById('alt-text-button');
    alt_box.classList.toggle('d-none');
    let tweet_box = document.getElementById('tweet-button');
    tweet_box.classList.toggle('d-none');
    let end_info = document.getElementById("end-info");
    end_info.classList.toggle('d-none');
    setAltText(data);
}

function setAltText(data) {
  alt_text = `
Digital Double for @${data['user']['username']}
${data['results']['top_domains'][0]['domain_name']}
1 ${data['results']['top_domains'][0]['entity_list'][0]}
2 ${data['results']['top_domains'][0]['entity_list'][1]}
3 ${data['results']['top_domains'][0]['entity_list'][2]}
4 ${data['results']['top_domains'][0]['entity_list'][3]}
${data['results']['top_domains'][1]['domain_name']}
1 ${data['results']['top_domains'][1]['entity_list'][0]}
2 ${data['results']['top_domains'][1]['entity_list'][1]}
3 ${data['results']['top_domains'][1]['entity_list'][2]}
4 ${data['results']['top_domains'][1]['entity_list'][3]}
${data['results']['top_domains'][2]['domain_name']}
1 ${data['results']['top_domains'][2]['entity_list'][0]}
2 ${data['results']['top_domains'][2]['entity_list'][1]}
3 ${data['results']['top_domains'][2]['entity_list'][2]}
4 ${data['results']['top_domains'][2]['entity_list'][3]}
${data['results']['top_domains'][3]['domain_name']}
1 ${data['results']['top_domains'][3]['entity_list'][0]}
2 ${data['results']['top_domains'][3]['entity_list'][1]}
3 ${data['results']['top_domains'][3]['entity_list'][2]}
4 ${data['results']['top_domains'][3]['entity_list'][3]}
${data['results']['top_domains'][4]['domain_name']}
1 ${data['results']['top_domains'][4]['entity_list'][0]}
2 ${data['results']['top_domains'][4]['entity_list'][1]}
3 ${data['results']['top_domains'][4]['entity_list'][2]}
4 ${data['results']['top_domains'][4]['entity_list'][3]}
${data['results']['top_domains'][5]['domain_name']}
1 ${data['results']['top_domains'][5]['entity_list'][0]}
2 ${data['results']['top_domains'][5]['entity_list'][1]}
3 ${data['results']['top_domains'][5]['entity_list'][2]}
4 ${data['results']['top_domains'][5]['entity_list'][3]}
Friends
${Object.keys(data['results']['top_friends']).map(function (key) {
  return "@" + key
}).join("\n")}`;
imageFoo = document.getElementById('result-image');
imageFoo.alt = alt_text;

}


  
