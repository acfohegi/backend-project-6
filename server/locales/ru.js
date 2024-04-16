// @ts-check

export default {
  translation: {
    appName: 'Менеджер задач',
    buttons: {
      edit: 'Изменить',
      delete: 'Удалить',
      createStatus: 'Создать статус',
      createTask: 'Создать задачу',
      createLabel: 'Создать метку',
    },
    flash: {
      labels: {
        create: {
          error: 'Не удалось создать метку',
          success: 'Метка успешно создана',
        },
        delete: {
          error: 'Не удалось удалить метку',
          success: 'Метка успешно удалена',
        },
        edit: {
          error: 'Не удалось изменить метку',
          success: 'Метка успешно изменена',
        },
      },
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      statuses: {
        create: {
          error: 'Не удалось создать статус',
          success: 'Статус успешно создан',
        },
        delete: {
          error: 'Не удалось удалить статус',
          success: 'Статус успешно удалён',
        },
        edit: {
          error: 'Не удалось изменить статус',
          success: 'Статус успешно изменён',
        },
      },
      tasks: {
        create: {
          error: 'Не удалось создать задачу',
          success: 'Задача успешно создана',
        },
        delete: {
          error: 'Не удалось удалить задачу',
          notCreatorError: 'Вы должны быть создателем задачи',
          success: 'Задача успешно удалена',
        },
        edit: {
          error: 'Не удалось изменить задачу',
          success: 'Задача успешно изменена',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        delete: {
          error: 'Не удалось удалить пользователя',
          success: 'Пользователь успешно удалён',
        },
        edit: {
          error: 'Не удалось изменить пользователя',
          success: 'Пользователь успешно изменён',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
      hasTasksError: 'Имеет связанные задачи',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        statuses: 'Статусы',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
        tasks: 'Задачи',
        labels: 'Метки',
      },
    },
    views: {
      labels: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        actions: 'Действия',
        edit: {
          title: 'Изменение метки',
          submit: 'Изменить',
        },
        new: {
          title: 'Создание метки',
          submit: 'Создать',
        },
      },
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      statuses: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        actions: 'Действия',
        edit: {
          title: 'Изменение статуса',
          submit: 'Изменить',
        },
        new: {
          title: 'Создание статуса',
          submit: 'Создать',
        },
      },
      tasks: {
        id: 'ID',
        name: 'Наименование',
        description: 'Описание',
        labels: 'Метки',
        label: 'Метка',
        statusId: 'Статус',
        executorId: 'Исполнитель',
        creatorId: 'Автор',
        myTasks: 'Только мои задачи',
        createdAt: 'Дата создания',
        actions: 'Действия',
        edit: {
          title: 'Изменение задачи',
          submit: 'Изменить',
        },
        new: {
          title: 'Создание задачи',
          submit: 'Создать',
        },
      },
      users: {
        id: 'ID',
        firstName: 'Имя',
        lastName: 'Фамилия',
        fullName: 'Полное имя',
        email: 'Email',
        password: 'Пароль',
        createdAt: 'Дата создания',
        actions: 'Действия',
        edit: {
          title: 'Редактирование пользователя',
        },
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
      },
      welcome: {
        index: {
          hello: 'Привет!',
          description: 'Описание',
          more: 'Узнать Больше',
        },
      },
    },
  },
};
