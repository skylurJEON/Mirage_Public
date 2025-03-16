import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { Team } from './entities/team.entity';
import { TeamAttributes } from './entities/team-attributes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, TeamAttributes])],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}