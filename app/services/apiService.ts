import { rejects } from "assert"
import { error } from "console"
import { resolve } from "path"
import { json } from "stream/consumers"

const apiService = {
    get: async function (url:string): Promise<any> {
        console.log('get', url)
        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                }
            })
            .then(response => response.json())
            .then((json) => {
                console.log('Response', json)
                resolve(json)
            })
            .catch((error => {
                reject(error)
            }))
        })
    },

    post: async function (url:string, data:any): Promise<any> {
        console.log('post', url, data)

        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                },
                body: data
            })
            .then(response => response.json())
            
            .then((json) => {
                resolve(json)
            })
            .catch((error) => {
                reject(error)
            })
        })
    }
}


export default apiService