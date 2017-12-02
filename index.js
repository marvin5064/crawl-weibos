const weiboCrawler = require('weibo-crawler')
const fs = require('fs')

var brands = [
    "Estee Lauder",
    "Christian Dior",
    "SK-II",
    "Shiseido",
    "Tom Ford",
    "La Prairie",
    "M.A.C.",
    "Laneige",
    "Benefit",
    "Burberry",
    "Celine",
    "MCM",
    "Furla",
    "Bvlgari",
    "Salvatore Ferragamo",
    "IWC Schaffhausen",
    "Daniel Wellington",
    "NARS",
    "Chanel",
    "Kiehls",
    "Cle De Peau",
    "Jo Malone",
    "Givenchy",
    "Origins",
    "Hera",
    "Shu Uemura",
    "Coach",
    "Jaeger Le Coultre",
    "Emporio Armani",
    "Lancome",
    "YSL",
    "Creme De La Mer",
    "Giorgio Armani",
    "Sulwhasoo",
    "Guerlain",
    "Fresh",
    "Bobbi Brown",
    "GUCCI",
    "Michael Kors",
    "Cartier",
    "Longchamp",
    "Longines",
    "Omega",
    "Tissot",
    "Swarovski"
]

var urls = {
    "Mr Bags": "https://www.weibo.com/p/1005052796274002/home?from=page_100505&mod=TAB#place",
    "Gogoboi": "https://www.weibo.com/p/1005051706372681/home?from=page_100505&mod=TAB#place"
}


function crawlDataWithUrl(kol, url){
    weiboCrawler(url)
    .then(data => {
        fs.writeFile('./'+kol+'_raw.json', JSON.stringify(data), (err) => {
            if (err) return err
        })
    })
    .catch(err => {
        console.error('Something went wrong.', err)
        return null
    })
};

function crawlData(){    
    for (var key in urls){
        console.log('Starts crawling data for', key,'from', urls[key])
        crawlDataWithUrl(key, urls[key])
    }
}

function cleanObjects(kol, objects) {
    processedItems = []
    for (var i in objects){
        item = objects[i]
        var createdAt = item.createdAt
        year = parseInt(createdAt)
        if (year < 2016 || !createdAt || createdAt.match(/[\u3400-\u9FBF]/)){
            continue
        }
        console.log("createdAt", createdAt)

        var textDetails = item.text
        // skip if no text
        if (!textDetails){
            continue
        }

        for (var bIndex in brands) {
            brandName = brands[bIndex]
            if (textDetails.indexOf(brandName.toLowerCase()) == -1) {
                continue
            }
            processedItem = {
                "Created At": createdAt,
                "Brand": brandName,
                "Comments Count": item.repostsCount,
                "Likes Count": item.commentsCount,
                "Reports Count": item.likesCount,
                "Key Opinion Leader": kol
            }
            processedItems.push(processedItem)
        }
    }
    return processedItems
}

function cleanData(){
    for (var key in urls){
        data = JSON.parse(fs.readFileSync(key + '_raw.json', 'utf8'))
        objects = cleanObjects(key, data)
        fs.writeFile('./'+key+'.json', JSON.stringify(objects), (err) => {
            if (err) return err
        })
    }
}


// crawlData() // networking job is heavy
cleanData()