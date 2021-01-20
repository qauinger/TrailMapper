// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: snowflake;
const size = new Size(3300, 2400);
const origin = new Point(0,0);
const url = 'https://www.bristolmountain.com/conditions';
const file = FileManager.local();
const dc = new DrawContext();
const msg = new Message();
const folder = file.bookmarkedPath('TrailMapper');
const map = file.readImage(folder+'/images/main.png');
const trails = file.readString(folder+'/trails.txt').split('\n');
const data = await getPage();
dc.size = size;
dc.drawImageAtPoint(map, origin);
await trails.forEach(overlayTrail);
let d = new Date();
let formattedDate = d.getUTCMonth()+1+'.'+d.getUTCDate()+'.'+d.getFullYear();
let final = dc.getImage()
if(!file.fileExists(folder+'/history/'+formattedDate+'.png')){
  file.writeImage(folder+'/history/'+formattedDate+'.png', final);    
  console.log('Conditions report has been saved to history.');
}
await QuickLook.present(final, true);
Pasteboard.copyImage(final);
Script.complete();

async function getPage(){
  let req = new Request(url);
  let data = await req.loadString();
  data = data.replace(/<[^>]*>?/gm, '');
  data = data.replaceAll('&#8217;', '');
  return data;
}

async function overlayTrail(trail){
  let regex = new RegExp(trail+'(?:open|closed)', 'i');
  let filename = data.match(regex)[0].replace(/\s+/g, '').toLowerCase();
  if(file.fileExists(folder+'/images/'+filename+'.png')){
    image = file.readImage(folder+'/images/'+filename+'.png');
    dc.drawImageAtPoint(image, origin);
  } else {
    console.warn(filename+'.png does not exist!');
  }
}