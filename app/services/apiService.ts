import { rejects } from "assert"
import { error } from "console"
import { resolve } from "path"
import { json } from "stream/consumers"
import { getAccessToken, getRefreshToken } from "../lib/actions"
const apiService = {
    get: async function (url: string): Promise<any> {
        console.log('GET request to:', url);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                // Log raw response for debugging
                const errorText = await response.text();
                console.error(`Error ${response.status}: ${errorText}`);
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Parse JSON if response is OK
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    },

    getWithToken: async function (url: string): Promise<any> {
        console.log('GET with token request to:', url);
        try {
            let token = await getAccessToken();
            if (!token) {
                token = await getRefreshToken()
                // throw new Error('Unauthorized: No valid token');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                // Log raw response for debugging
                const errorText = await response.text();
                console.error(`Error ${response.status}: ${errorText}`);
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Parse JSON if response is OK
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    },

    postWithoutToken: async function (url: string, data: any, isFormData = false): Promise<any> {
        console.log('post', url, data);
      
        return new Promise((resolve, reject) => {
          // Set default headers
          const headers: { [key: string]: string } = {
            'Accept': 'application/json', // Always expect JSON response
          };
      
          if (!isFormData) {
            // For JSON data, set Content-Type explicitly
            headers['Content-type'] = 'application/json';
            data = JSON.stringify(data); // Convert data to JSON string
          }
      
          fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
            method: 'POST',
            headers,
            body: data, // FormData or JSON string
          })
            .then(async (response) => {
              if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
              }
              return response.json(); // Parse response as JSON
            })
            .then((json) => {
              resolve(json);
            })
            .catch((error) => {
              console.error('Error during POST:', error);
              reject(error);
            });
        });
      },
      
    
    post: async function (url:string, data:any): Promise<any> {
        console.log('post', url, data)
        return new Promise(async (resolve, reject) => {
            let token = await getAccessToken();
        
            if (!token) {
                reject("Unauthorized: No valid token");
                return;
              }
                fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
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
    },

    put: async function (url: string, data:any): Promise<any> {
        console.log('put', url, data)
        return new Promise(async (resolve, reject) => {
            let token = await getAccessToken()

            if (!token) {
                reject("Unauthorized: No valid token");
                return;
            }

            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: data
            })
            .then((response) => response.json())
            .then((json) => {
                resolve(json)
            })
            .catch ((error) => {
                reject(error)
            })
        })
    }
}


export default apiService