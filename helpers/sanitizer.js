const validationErr = errors => {
    return JSON.parse(JSON.stringify(errors, validationErrReplacer));
};

const user = user => {
    return JSON.parse(JSON.stringify(user, userReplacer));
};

const job = job => {
    return JSON.parse(JSON.stringify(job, jobReplacer));
}

const jobs = jobs => {
    return jobs.map((j) => {
        return job(j);
    });
}

const userReplacer = (key, val) => {
    if (['', 'id', 'name', 'email', 'activated', 'created_at'].includes(key)) {
        return val;
    } 
    return undefined;
};

const validationErrReplacer = (key, val) => {
    const excluded = [
        'name', 'email', 'password', 'token', 'title', 'description',
        'company_name', 'apply_url', 'type', 'company_market', 'skills',
        'location', 'remote'
    ]

    if (key == 'rule') {
        return undefined;
    } else if (excluded.includes(key)) {
        return val.message;
    }
    return val;
};

const jobReplacer = (key, val) => {
    if (val == null) {
        return undefined;
    }

    if (['user_id','version'].includes(key)) {
        return undefined;
    }

    return val;
}

export default {
    user,
    validationErr,
    job,
    jobs
};