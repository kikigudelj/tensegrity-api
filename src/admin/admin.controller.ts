import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';

import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users/pending')
  getPendingUsers() {
    return this.adminService.getPendingUsers();
  }

  @Patch('users/:id/approve')
  approve(@Param('id') id: string) {
    return this.adminService.approveUser(id);
  }

  @Patch('users/:id/reject')
  reject(@Param('id') id: string) {
    return this.adminService.rejectUser(id);
  }
}
