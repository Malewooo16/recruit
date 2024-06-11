export const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Talent Management REST API",
            version: "1.0.0",
            description: "This is the API definition for Talent Management"
        },
        servers: [
            {  
                url: 'http://localhost:3000/api',
                description: 'Development Server'
            }
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            description: 'User email for login'
                        },
                        password: {
                            type: 'string',
                            description: 'User password for login'
                        },
                      
                    }
                },
                Recruit: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Recruit id'
                        },
                        firstname: {
                            type: 'string',
                            description: 'Recruit firstname'
                        },
                        lastname: {
                            type: 'string',
                            description: 'Recruit lastname'
                        },
                        emailAddress: {
                            type: 'string',
                            description: 'Recruit emailAddress'
                        },
                        userId: {
                            type: 'string',
                            description: 'Recruit userId'
                        }
                    }
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        email: {
                            type: 'string',
                            description: 'User email'
                        },
                        role: {
                            type: 'string',
                            description: 'User role'
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Error message'
                        },
                        success: {
                            type: 'boolean',
                            description: 'Error Status'
                        }
                    }
                }
            },
            responses: {
                Unauthorized: {
                    description: 'Invalid Email/Password',
                    contents: 'application/json'
                },
                Forbidden: {
                    description: 'Please Login to gain access',
                    contents: 'application/json'
                }
            },
            securitySchemes:{
                AccessToken:{
                    type:"apiKey",
                    in:'cookie',
                    name:"token"
                }
            }
        }, 
        security:[{
            AccessToken:[]
        }]
    },
    apis: ['./app/routes/*.js']
};
