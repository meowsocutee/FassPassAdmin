export type PermValue = boolean | null; // true=มีสิทธิ์, false=ไม่มีสิทธิ์, null=ไม่เกี่ยวข้อง

export interface RoleMatrixRow {
  type: 'category' | 'item';
  label?: string;         // สำหรับ category row
  feature?: string;       // สำหรับ item row
  guest?:       PermValue;
  user?:        PermValue;
  staff?:       PermValue;
  visitor?:     PermValue;
  checkAdmin?:  PermValue;
  inviteAdmin?: PermValue;
  admin?:       PermValue;
  superAdmin?:  PermValue;
}

export const ROLE_MATRIX_DATA: RoleMatrixRow[] = [

  // ─── Category 1 ────────────────────────────────────────────
  { type: 'category', label: 'การใช้งานพื้นฐาน (Basic Usage)' },
  {
    type: 'item', feature: 'ดูแผนที่และสถานะลานจอดรถ',
    guest: true,  user: true,  staff: true,  visitor: true,
    checkAdmin: null, inviteAdmin: null, admin: null, superAdmin: null
  },
  {
    type: 'item', feature: 'นำรถเข้าจอดและใช้งานลานจอด',
    guest: true,  user: true,  staff: true,  visitor: true,
    checkAdmin: null, inviteAdmin: null, admin: null, superAdmin: null
  },
  {
    type: 'item', feature: 'บันทึกส่วนลด / ใช้ E-Stamp',
    guest: true,  user: true,  staff: true,  visitor: true,
    checkAdmin: null, inviteAdmin: null, admin: null, superAdmin: null
  },
  {
    type: 'item', feature: 'จองที่จอดรถล่วงหน้า',
    guest: false, user: true,  staff: true,  visitor: true,
    checkAdmin: null, inviteAdmin: null, admin: null, superAdmin: null
  },
  {
    type: 'item', feature: 'จัดการช่องจอดโปรด (Bookmark)',
    guest: false, user: true,  staff: true,  visitor: true,
    checkAdmin: null, inviteAdmin: null, admin: null, superAdmin: null
  },
  {
    type: 'item', feature: 'ดูรายการแจ้งเตือน',
    guest: false, user: true,  staff: true,  visitor: true,
    checkAdmin: null, inviteAdmin: null, admin: null, superAdmin: null
  },

  // ─── Category 2 ────────────────────────────────────────────
  { type: 'category', label: 'การจัดการลานจอด (Parking Management)' },
  {
    type: 'item', feature: 'ควบคุมไม้กั้นทางเข้า-ออกแบบ Manual',
    guest: null,  user: null,  staff: null,  visitor: null,
    checkAdmin: true,  inviteAdmin: false, admin: true,  superAdmin: true
  },
  {
    type: 'item', feature: 'จัดการ / เปลี่ยนสถานะช่องจอดรถแบบ Manual',
    guest: null,  user: null,  staff: null,  visitor: null,
    checkAdmin: true,  inviteAdmin: false, admin: true,  superAdmin: true
  },
  {
    type: 'item', feature: 'มอบสิทธิ์ Visitor ให้บุคคลภายนอก',
    guest: null,  user: null,  staff: null,  visitor: null,
    checkAdmin: false, inviteAdmin: true,  admin: false, superAdmin: true
  },

  // ─── Category 3 ────────────────────────────────────────────
  { type: 'category', label: 'การจัดการระบบ (System Administration)' },
  {
    type: 'item', feature: 'ดูรายงานและสถิติการจอดรถ (Report)',
    guest: null,  user: null,  staff: null,  visitor: null,
    checkAdmin: false, inviteAdmin: false, admin: true,  superAdmin: true
  },
  {
    type: 'item', feature: 'กำหนดค่าระบบจอดรถ (ราคา, เวลา, สถานะลาน)',
    guest: null,  user: null,  staff: null,  visitor: null,
    checkAdmin: false, inviteAdmin: false, admin: true,  superAdmin: true
  },
  {
    type: 'item', feature: 'จัดการสิทธิ์ผู้ใช้งานเบื้องต้น (แก้ไข/ระงับบัญชี)',
    guest: null,  user: null,  staff: null,  visitor: null,
    checkAdmin: false, inviteAdmin: false, admin: true,  superAdmin: true
  },
  {
    type: 'item', feature: 'อนุมัติและปรับเปลี่ยนสิทธิ์ขั้นสูง (Role Change)',
    guest: null,  user: null,  staff: null,  visitor: null,
    checkAdmin: false, inviteAdmin: false, admin: false, superAdmin: true
  },
];
