import Program from "../models/Program";

export const getAllPrograms = async () => {
    try {
        const programs = await Program.findAll();
        return programs;
    } catch (error) {
        console.error('Error fetching programs:', error);
        throw error;
    }
};

export const getProgramById = async (id) => {
    try {
        const program = await Program.findByPk(id);
        return program;
    } catch (error) {
        console.error(`Error fetching program with id ${id}:`, error);
        throw error;
    }
}

export const createProgram = async (programData) => {
    try {
        const program = await Program.create(programData);
        return program;
    } catch (error) {
        console.error('Error creating program:', error);
        throw error;
    }
};

export const updateProgram = async (id, programData) => {
    try {
        const program = await Program.findByPk(id);
        if (!program) throw new Error("Program not found");
        return await program.update(programData);
    } catch (error) {
        console.error(`Error updating program with id ${id}:`, error);
        throw error;
    }
};

export const deleteProgram = async (id) => {
    try {
        const program = await Program.findByPk(id);
        if (!program) throw new Error("Program not found");
        await program.destroy();
        return { message: "Program deleted successfully" };
    } catch (error) {
        console.error(`Error deleting program with id ${id}:`, error);
        throw error;
    }
};

export const importProgramsFromJSON = async (programsData) => {
    try {
        if (!programsData || !Array.isArray(programsData)) {
            throw new Error("Dữ liệu không hợp lệ");
        }

        const results = {
            success: [],
            errors: [],
            total: programsData.length
        };

        //validate and create program for each item
        for (let i = 0; i < programsData.length; i++) {
            const programData = programsData[i];
            const index = i + 1;

            try {
                //validate required fields
                if (!programData.program_id || !programData.program_name) {
                    results.errors.push({
                        index: index,
                        program_id: programData.program_id || 'N/A',
                        error: 'Mã chương trình và tên chương trình là bắt buộc'
                    });
                    continue;
                }

                // clean and format data (chuyển sang kiểu chuỗi và xóa khoảng cách thừa ở đầu chuỗi và cuối chuỗi)
                const cleanedData = {
                    program_id: programData.program_id.toString().trim(),
                    program_name: programData.program_name.toString().trim(),
                    description: programData.description ? programData.description.toString().trim() : null,
                    status: programData.status || 'Hoạt động' // Mặc định là 'hoạt động' nếu không có giá trị,
                }

                // Kiểm tra program_id đã tồn tại chưa
                const existingProgram = await Program.findOne({
                    where: { program_id: cleanedData.program_id }
                });
                if (existingProgram) {
                    results.errors.push({
                        index: index,
                        program_id: cleanedData.program_id,
                        error: 'Mã chương trình đã tồn tại'
                    });
                    continue;
                }

                // Tạo Program mới
                const newProgram = await Program.create(cleanedData);
                results.success.push(newProgram);

            } catch (error) {
                results.errors.push({
                    index: index,
                    program_id: programData.program_id || 'N/A',
                    error: error.message || 'Lỗi không xác định'
                });
            }
        }
        return results;
    } catch (error) {
        console.error("Error importing programs from JSON:", error);
        throw error;
    }
};