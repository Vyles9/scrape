import * as cheerio from "cheerio"
import axios from "axios"

async function headlines() {
    const URL = "https://www.livechart.me/headlines"
    try {
        const { data } = await axios.get(URL)
        const $ = cheerio.load(data)
        const result = []
        
        $('div.flex.p-4').each((index, element) => {
            const title = $(element).find('a.link.link-hover.font-medium').text()
            const source = $(element).find('a.link.link-hover.font-medium').attr('href')
            const link = $(element).find('a.whitespace-nowrap.link-hover').attr('href')
            const date = $(element).find('a.whitespace-nowrap.link-hover > time').attr('datetime')
            const thumbnail = $(element).find('img.aspect-square.overflow-hidden').attr('src').replace('small', 'medium')
            
            result.push({
                title,
                source,
                link: 'https://www.livechart.me' + link,
                date,
                thumbnail
            })
        })
        
        return {
            success: true,
            data: result
        }
    } catch (err) {
        return {
            success: false,
            message: err.message
        }
    }
}

async function schedule() {
    const URL = "https://www.livechart.me/schedule"
    try {
        const { data } = await axios.get(URL)
        const $ = cheerio.load(data)

        const schedule = {}
        
        $('.lc-timetable-day').each((_, el) => {
            const days = $(el).find('.lc-timetable-day__heading h2').text()
            schedule[days] = []
            
            $(el).find('.lc-timetable-timeslot').each((_, el) => {
                const time = $(el).find('.lc-timetable-timeslot__content span span').text()
                
                $(el).find('.lc-timetable-anime-block').each((_, el) => {
                    const title = $(el).find('.lc-tt-anime-title').text()
                    const link = $(el).find('.lc-tt-anime-title').attr('href')
                    const episode = $(el).find('.lc-tt-release-label span').text()
                    
                    schedule[days].push({
                        time,
                        title,
                        link: 'https://www.livechart.me'+ link,
                        episode,
                    })
                })
            })
        })
        
        return {
            success: true,
            data: schedule
        }
        
    } catch (err) {
        return {
            success: false,
            message: err.message
        }
    }
}

async function search(q) {
    const URL = "https://www.livechart.me/search?q="+ q
    try {
        const { data } = await axios.get(URL)
        const $ = cheerio.load(data)
        const result = []
        
        $('.callout.grouped-list.anime-list > .grouped-list-item.anime-item').each((_, el) => {
            const title = $(el).find('.anime-item__body__title strong a').text().trim()
            const episode = $(el).find('.anime-item__body__title > span').text()
            const link = $(el).find('.anime-item__body__title strong a').attr('href')
            const premiere_date_time = $(el).find('.info > span').first().text()
            const rating = $(el).find('.info > .fake-link').text()
            
            result.push({
                title,
                episode: episode.replace(/[()]/g, '').split(',')[1]?.trim(),
                link: 'https://www.livechart.me'+ link,
                premiere_date_time,
                rating
            })
        })
        
        return {
            success: true,
            data: result
        }
        
    } catch (err) {
        return {
            success: false,
            message: err.message
        }
    }
}

export { headlines, schedule, search }
