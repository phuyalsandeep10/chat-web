import axiosInstance, { baseURL } from '@/apiConfigs/axiosInstance';

export class TeamsService {
  // Create Teams
  static async CreateTeams(payload: any) {
    try {
      const res = await axiosInstance.post(`${baseURL}/teams`, payload);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  // Invite  Teams
  static async InviteTeams(payload: any) {
    try {
      const res = await axiosInstance.post(
        `${baseURL}/organizations/invitation`,
        payload,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  // get Teams
  static async GetTeams() {
    try {
      const res = await axiosInstance.get(`${baseURL}/teams`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  //Delete Teams
  static async DeleteTeams(team_id: string) {
    // deleting teams
    try {
      const res = await axiosInstance.delete(`${baseURL}/teams/${team_id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  // get team members by id
  static async getTeamMembersById(teamId: number) {
    try {
      const res = await axiosInstance.get(`${baseURL}/teams/${teamId}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  // update multiple team members by teamId
  static async updateTeamMembersById(
    team_id: number,
    members: { member_id: number; access_level: string }[],
  ) {
    try {
      const res = await axiosInstance.put(
        `${baseURL}/teams/${team_id}/members/access-level`,
        { members }, // send as array
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  // delete members from team
  static async deleteMemberFromTeam(team_id: number, member_id: number) {
    try {
      const res = await axiosInstance.delete(
        `${baseURL}/teams/team/${team_id}/member/${member_id}/access-level`,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}
