const mockData = {
    users: [
        {
            id: 'user1',
            username: 'crazyCat',
            name: 'Crazy Cat',
            role: 'student',
            profile: {
                interests: ['Art', 'Music', 'Gaming'],
                goals: ['Create a digital art portfolio', 'Learn guitar', 'Develop a game']
            }
        },
        {
            id: 'user2',
            username: 'wildWolf',
            name: 'Wild Wolf',
            role: 'teacher',
            profile: {
                interests: ['Nature', 'Photography'],
                goals: ['Publish a photography book', 'Lead outdoor workshops']
            }
        },
        {
            id: 'user3',
            username: 'funkyFrog',
            name: 'Funky Frog',
            role: 'admin',
            profile: {
                interests: ['Technology', 'Innovation'],
                goals: ['Implement new tech solutions', 'Organize tech fairs']
            }
        }
    ],
    timetable: [
        {
            classId: 'ART101',
            subject: 'Crazy Art',
            teacherId: 'user2',
            students: ['user1'],
            time: '10:00 - 11:30'
        },
        {
            classId: 'MUSIC202',
            subject: 'Funky Music',
            teacherId: 'user2',
            students: ['user1'],
            time: '12:00 - 13:30'
        },
        {
            classId: 'GAME303',
            subject: 'Game Development',
            teacherId: 'user2',
            students: ['user1'],
            time: '14:00 - 15:30'
        }
    ],
    attendance: {
        '2023-10-01_ART101_user1': { studentId: 'user1', classId: 'ART101', date: '2023-10-01', status: 'present' },
        '2023-10-01_MUSIC202_user1': { studentId: 'user1', classId: 'MUSIC202', date: '2023-10-01', status: 'absent' },
        '2023-10-01_GAME303_user1': { studentId: 'user1', classId: 'GAME303', date: '2023-10-01', status: 'present' }
    }
};

export default mockData;