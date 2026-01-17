
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/3-interface-adapters/guards/jwt-auth.guard';
import { GetActiveInstitutionalMessageUseCase } from '../../2-application/use-cases/get-active-institutional-message.usecase';

@Controller('institutional-messages')
export class InstitutionalMessageController {
    constructor(
        private readonly getActiveMessageUseCase: GetActiveInstitutionalMessageUseCase,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('active')
    async getActive(@Request() req: any) {
        const condominiumId = req.user.condominiumId;
        return this.getActiveMessageUseCase.execute(condominiumId);
    }
}
