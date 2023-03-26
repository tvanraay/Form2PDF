const api = window.electronAPI;

const func = () => {
    api.postFilePath("test");
};

const func2 = async () => {
    const response = await api.getFilePath();
    alert(response);
};

func();
func2();