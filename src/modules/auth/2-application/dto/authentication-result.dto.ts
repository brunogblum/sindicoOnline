export class AuthenticationResultDto {
    constructor(
        public readonly accessToken: string,
        public readonly userId: string,
        public readonly role: string,
    ) { }
}
