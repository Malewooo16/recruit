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
                //TODO check for missing or inaccurate schemas
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
                Application: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'integer',
                        description: 'Application ID'
                      },
                      jobName: {
                        type: 'string',
                        description: 'Application Job Name'
                      },
                      recruitId: {
                        type: 'integer',
                        description: 'Recruit ID'
                      },
                      jobOfferId: {
                        type: 'integer',
                        description: 'Job offer ID'
                      },
                      status: {
                        type: 'string',
                        description: 'Application status'
                      },
                      createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Creation timestamp'
                      },}},
                Company: {
                    type: 'object',
                    required:['name', 'phoneNumber', 'emailAddress', 'address', 'website'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Company id'
                        },
                        name: {
                            type: 'string',
                            description: 'Company Name'
                        },
                        phoneNumber: {
                            type: 'string',
                            description: 'Company Phone Number'
                        },
                        emailAddress: {
                            type: 'string',
                            description: 'Company emailAddress'
                        },
                        address: {
                            type: 'string',
                            description: 'Company Physical Address'
                        },
                        industy: {
                            type: 'string',
                            description: 'Company Industry'
                        },
                        website: {
                            type: 'string',
                            description: 'Company Website'
                        },
                    }
                },
                Interview: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'integer',
                        description: 'Interview ID'
                      },
                      recruitId: {
                        type: 'integer',
                        description: 'Recruit ID'
                      },
                      jobOfferId: {
                        type: 'integer',
                        description: 'Job offer ID'
                      },
                      date: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Date and time of the interview'
                      },
                      status: {
                        type: 'string',
                        description: 'Interview status'
                      },
                      createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Creation timestamp'
                      },
                      updatedAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Update timestamp'
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
