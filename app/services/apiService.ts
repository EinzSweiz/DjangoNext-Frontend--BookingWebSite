import { rejects } from "assert"
import { error } from "console"
import { resolve } from "path"
import { json } from "stream/consumers"
import { getAccessToken, getRefreshToken } from "../lib/actions"
const apiService = {
    get: async function (url: string): Promise<any> {
        console.log('GET request to:', url);
        try {
            // Retrieve the token asynchronously
            const token = await getAccessToken();

            // Prepare headers, including Authorization if token exists
            const headers: HeadersInit = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // Make the GET request
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'GET',
                headers: headers,
            });

            // Check for response status
            if (!response.ok) {
                const errorText = await response.text(); // Log raw response for debugging
                console.error(`Error ${response.status}: ${errorText}`);
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Parse and return JSON if response is OK
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
        console.log('post', url, data)
    
        return new Promise((resolve, reject) => {
            // Set default headers
            const headers: { [key: string]: string } = {
                'Accept': 'application/json', // Always expect JSON response
            }
    
            let body = data;
    
            if (isFormData) {
                // Do not manually set 'Content-Type' for FormData; let the browser handle it
                body = data; // Expecting `data` to be an instance of `FormData`
            } else {
                // For JSON data
                headers['Content-Type'] = 'application/json';
                body = data; // Convert data to JSON string
            }
    
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'POST',
                headers,
                body,
            })
            .then(response => response.json())
            .then((json) => {
                resolve(json);
            })
            .catch((error) => {
                reject(error);
            });
        });
    },
    
    
    post: async function (url:string, data:any): Promise<any> {
        console.log('post', url, data)
        console.log('DATA:', data)
        return new Promise(async (resolve, reject) => {
            let token = await getAccessToken();
            console.log('Token:', token)
        
            if (!token) {
                reject("Unauthorized: No valid token");
                return;
              }
                fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
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
    postWithoutImages: async function (url: string, data: any): Promise<any> {
        console.log('post', url, data);
        
        try {
            // Retrieve the token
            let token = await getAccessToken();
            console.log('Token:', token);
    
            // Check if token exists
            if (!token) {
                throw new Error("Unauthorized: No valid token");
            }
    
            // Make the fetch request with async/await
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json', // Correct header for JSON data
                },
                body: JSON.stringify(data),  // Ensure data is serialized
            });
    
            // Check if the response is OK (status code 200-299)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            // Parse and return the JSON response
            const json = await response.json();
            return json;
    
        } catch (error) {
            console.error('Error in POST request:', error);
            throw error; // Re-throw the error after logging it
        }
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
    },
    putWithoutImage: async function (url: string, data:any): Promise<any> {
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
                    'Content-Type': 'application/json'
                    
                },
                body: JSON.stringify(data)
            })
            .then((response) => response.json())
            .then((json) => {
                resolve(json)
            })
            .catch ((error) => {
                reject(error)
            })
        })
    },
}


export default apiService