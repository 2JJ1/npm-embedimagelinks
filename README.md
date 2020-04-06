
# embedimagelinks

Converts image links in your HTML's text nodes to to img tags

#### Import
```
const embedImageLinks = require('embedimagelinks')
```

#### Example Usage
```
...
const newHTML = await embedImageLinks("<p>https://gyazo.com/da87b8bc2d1796ff6e21efaf8ba8b838</p>")
//output: <p><img src="https://gyazo.com/da87b8bc2d1796ff6e21efaf8ba8b838"></p>
...
```

### Options
All options default to true
```
{
//Checks for known Gyazo screenshot links and display's it's image source
gyazo: boolean, 
//Checks for known Imgur screenshot links and display's an Imgur oEmbed
imgur: boolean, 
//Will assume that any link that ends with .png, .jpg, or .gif is an image link and displays it
imgFile: boolean, 
}
```