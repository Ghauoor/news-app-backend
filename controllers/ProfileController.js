class ProfileController {
    static async index(req, res) {
        try {
            const user = req.user;
            return res.status(200).json({ status: 200, data: user });
        } catch (error) {
            return res.status(500).json({ status: 500, error: error.message });
        }
    }

    static async store() { }
    static async show() { }
    static async update() { }
    static async destroy() { }



}


export default ProfileController;