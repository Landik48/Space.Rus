const API_URL = import.meta.env.VITE_API_URL;

async function graphqlRequest(query: string, variables = {}) {
    const headers: any = {
        "Content-Type": "application/json"
    };

    const response = await fetch(API_URL + '/graphql', {
        method: 'POST',
        headers,
        body: JSON.stringify({
            query,
            variables
        }),
        credentials: 'include'
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0]?.message || "Ошибка сервера");
    }

    return result.data;
}

export const Api = {
    async register(form: any) {
        const query = `
            mutation CreateUser($createUserInput: CreateUserInput!) {
                createUser(createUserInput: $createUserInput) {
                    id
                    email
                    firstname
                    lastname
                    profile_picture
                }
            }
        `;

        const data = await graphqlRequest(query, {
            createUserInput: form
        });

        const result = {user: data.createUser};

        return result;
    },

    async login(form: any) {
        const query = `
            mutation AuthUser($authUserInput: AuthUserInput!) {
                authUser(authUserInput: $authUserInput) {
                    id
                    email
                    firstname
                    lastname
                    profile_picture
                }
            }
        `;

        const data = await graphqlRequest(query, {
            authUserInput: {
                email: form.email,
                password: form.password
            }
        });

        const result = {user: data.authUser};

        return result;
    },

    async me() {
        const query = `
            query {
                findMe {
                    id
                    email
                    firstname
                    lastname
                    profile_picture
                }
            }
        `;

        const data = await graphqlRequest(query);

        return data.findMe;
    },

    async logout() {
        const query = `
            mutation {
                logout 
            }
        `;

        await graphqlRequest(query);
    },

    async update(id: number, file: File) {
        const query = `
        mutation UpdateUser($updateUserInput: UpdateUserInput!) {
        updateUser(updateUserInput: $updateUserInput)
        }
    `;

        const formData = new FormData();

        const operations = {
            query,
            variables: {
                updateUserInput: {
                    id,
                    file: null
                }
            }
        };

        const map = {
            "0": ["variables.updateUserInput.file"]
        };

        formData.append("operations", JSON.stringify(operations));
        formData.append("map", JSON.stringify(map));
        formData.append("0", file);

        const response = await fetch(API_URL + '/graphql', {
            method: 'POST',
            body: formData,
            credentials: 'include',
            headers: {
                "apollo-require-preflight": "true"
            }
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result?.errors?.[0]?.message || `HTTP error: ${response.status}`);
        }

        if (result.errors && result.errors.length > 0) {
            throw new Error(result.errors[0]?.message || 'Ошибка сервера');
        }

        return result.data.updateUser;
    },

    async ArticlesGet(skip: number, take: number) {
        const query = `
            query GetArticles($getArticlesInput: GetArticlesInput!) {
                findArticles(getArticlesInput: $getArticlesInput) {
                    id
                    title
                    description
                    img_link
                    article_link
                    test_id
                }
            }
        `;

        const data = await graphqlRequest(query, {
            getArticlesInput: { skip, take }
        });

        return data.findArticles;
    },

    async ArticlesCompletedGet(skip: number, take: number) {
        const query = `
            query GetArticles($getArticlesInput: GetArticlesInput!) {
                findCompletedArticles(getArticlesInput: $getArticlesInput) {
                    id
                    title
                    description
                    img_link
                    article_link
                    test_id
                }
            }
        `;

        const data = await graphqlRequest(query, {
            getArticlesInput: { skip, take }
        });

        return data.findCompletedArticles;
    },

    async TestGet(testId: number) {
        const query = `
            query GetTest($testId: Int!) {
                getTest(testId: $testId) {
                    id
                    name
                    body
                }
            }
        `;

        const data = await graphqlRequest(query, {
            testId
        });

        return data.getTest;
    },

    async TestComplete(test_id: number, answers: any) {
        const query = `
            mutation SubmitTest($input: SubmitTestInput!) {
                submitTest(input: $input)
            }
        `;

        const data = await graphqlRequest(query, {
            input: {
                test_id,
                answers
            }
        });

        return data.submitTest;
    },

    async getAchievements() {
        const query = `
            query {
                getAchievements {
                    id
                    title
                    description
                    image_link
                    date
                }
            }`

        const data = await graphqlRequest(query)
        return data.getAchievements
    },

    async getTime() {
        const query = `
            query {
            getTime
            }
        `;

        const data = await graphqlRequest(query);
        return data.getTime as number;
    },

    async updateTime(time: number) {
        const query = `
            mutation UpdateTime($time: Int!) {
            updateTime(time: $time)
            }
        `;

        const data = await graphqlRequest(query, { time });
        return data.updateTime as boolean;
    },

    async scoreMe() {
        const query = `
            query {
                scoreMe
            }
        `;

        const data = await graphqlRequest(query);
        return data.scoreMe as number;
    },

    async scores() {
        const query = `
            query {
                scores {
                    firstname
                    lastname
                    profile_picture
                    xp
                }
            }
        `;

        const data = await graphqlRequest(query);
        return data.scores as {
            firstname: string;
            lastname: string;
            profile_picture: string;
            xp: number;
        }[];
    },
};