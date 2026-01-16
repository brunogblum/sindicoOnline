import { RolesGuard } from '../../../../3-interface-adapters/guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../../../1-domain/entities/auth-user.entity';

describe('RolesGuard', () => {
    let guard: RolesGuard;
    let reflector: Reflector;

    beforeEach(() => {
        reflector = new Reflector();
        guard = new RolesGuard(reflector);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    it('should return true if no roles are required', () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);
        const context = createMockContext(null);
        expect(guard.canActivate(context)).toBe(true);
    });

    it('should return true if user has required role', () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);
        const context = createMockContext({ role: UserRole.ADMIN });
        expect(guard.canActivate(context)).toBe(true);
    });

    it('should return false if user does not have required role', () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);
        const context = createMockContext({ role: UserRole.MORADOR });
        expect(guard.canActivate(context)).toBe(false);
    });

    it('should return false if user is undefined', () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);
        const context = createMockContext(undefined);
        expect(guard.canActivate(context)).toBe(false);
    });
});

function createMockContext(user: any): ExecutionContext {
    return {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
            getRequest: jest.fn().mockReturnValue({ user }),
        }),
    } as any;
}
