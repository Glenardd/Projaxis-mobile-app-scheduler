interface user{
    id: number,
    projectName: string,
    activties: activity[]
};

interface activity{
    id: number,
    activityName: string
};

export class Users{
    private data: user[] = [ 
        {
            id:1,
            projectName:"Project A",
            activties: [
                {
                    id: 1,
                    activityName: "Activity A"
                },
                {
                    id: 2,
                    activityName: "Activity B"
                }
            ]
        },
        {
            id:2,
            projectName:"Activity B",
            activties: [
                {
                    id: 1,
                    activityName: "Activity A"
                },
                {
                    id: 2,
                    activityName: "Activity B"
                },
                {
                    id: 3,
                    activityName: "Activity C"
                }
            ]
        }
    ];

    getData(){
        return this.data;
    };

    //find user data
    findData(id:number){
        return this.data.find((data)=> data.id === id);
    };
};