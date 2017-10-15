export enum DBOperation {
    create = 1,
    update = 2,
    delete = 3
}

export enum PermissionLevel {
    regular,
    userManager,
    administrator,
    undefined
}