export const ROLES = { ADMIN: 'ADMIN', TRADER: 'TRADER', COMPLIANCE: 'COMPLIANCE' };
export function allow(...roles){
return function(req,res,next){
const ok = roles.includes(req.user?.role);
if(!ok) return res.status(403).json({ error: 'forbidden' });
next();
};
}