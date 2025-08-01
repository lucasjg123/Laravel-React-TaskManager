import { Button } from '@/components/ui/button';
import { DialogClose, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { Calendar, CheckCircle, CheckCircle2, ChevronLeft, ChevronRight, List, Pencil, Plus, Search, Trash2, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Task {
    id: number;
    title: string;
    description: string | null;
    is_completed: boolean;
    due_date: string | null;
    list_id: number;
    list: {
        id: number;
        title: string;
    };
}

interface List {
    id: number;
    title: string;
}
interface Props {
    tasks: {
        data: Task[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    lists: List[];
    filters: {
        search: string;
        filter: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: 'tasks',
    },
];

export default function TasksIndex({ tasks, lists, filters, flash }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [completionFilter, setCompletionFilter] = useState<'all' | 'completed' | 'pending'>(filters.filter as 'all' | 'completed' | 'pending');

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType('success');
            setShowToast(true);
        } else if (flash?.error) {
            setToastMessage(flash.error);
            setToastType('error');
            setShowToast(true);
        }
    }, [flash]);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    // hook de form para utilizar funciones del mismo
    const {
        data,
        setData,
        post,
        put,
        processing,
        reset,
        delete: destroy,
    } = useForm({
        // campos del form
        title: '',
        description: '',
        due_date: '',
        list_id: '',
        is_completed: false as boolean,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingTask)
            put(route('tasks.update', editingTask.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    setEditingTask(null);
                },
            });
        else
            post(route('tasks.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setData({
            title: task.title,
            description: task.description || '',
            due_date: task.due_date || '',
            list_id: task.list_id.toString(),
            is_completed: task.is_completed,
        });
        setIsOpen(true);
    };
    const handleDelete = (taskId: number) => {
        destroy(route('tasks.destroy', taskId));
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(
            route('tasks.index'),
            {
                search: searchTerm,
                filter: completionFilter || 'all',
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleFilterChange = (value: 'all' | 'completed' | 'pending') => {
        setCompletionFilter(value);
        router.get(
            route('tasks.index'),
            {
                search: searchTerm,
                filter: value,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            route('tasks.index'),
            {
                page,
                search: searchTerm,
                filter: completionFilter,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />

            {/* Contenedor principal de la vista */}
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl bg-gradient-to-br from-background to-muted/20 p-6">
                {showToast && (
                    <div
                        className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white animate-in fade-in slide-in-from-top-5`}
                    >
                        {toastType === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                        <span>{toastMessage}</span>
                    </div>
                )}

                {/* Header con título y botón */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="tracking-light text-3xl font-bold">Tasks</h1>
                        <p className="mt-1 text-muted-foreground">Manage your tasks and stay organized</p>
                    </div>

                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger>
                            <Button asChild className="cursor-pointer bg-primary text-white shadow-lg hover:bg-primary/90">
                                <span className="inline-flex items-center">
                                    <Plus className="mr-2 h-4 w-4" />
                                    New Task
                                </span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="fixed inset-0 z-50 flex items-center justify-center">
                            {/* Fondo oscuro que cubre toda la pantalla */}
                            <div className="absolute inset-0 z-10 bg-black opacity-80" />

                            {/* Modal con contenido, utilizando 'relative' para posicionar el botón */}
                            <div className="relative z-20 w-full rounded-lg bg-white p-6 shadow-lg sm:max-w-[425px]">
                                {/* Botón de cierre (X) en la esquina superior derecha */}
                                <DialogClose asChild>
                                    <button
                                        type="button"
                                        className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700"
                                        aria-label="Close"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </DialogClose>

                                <DialogHeader>
                                    <DialogTitle className="text-xl">{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            required
                                            className="focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            className="focus:ring-2 focus:ring-primary"
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="list_id">List</Label>
                                        <Select value={data.list_id} onValueChange={(value) => setData('list_id', value)}>
                                            <SelectTrigger className="focus:ring-2 focus:ring-primary">
                                                <SelectValue placeholder="Select a list" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {lists.map((list) => (
                                                    <SelectItem key={list.id} value={list.id.toString()}>
                                                        {list.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="due_date">Due Date</Label>
                                        <Input
                                            id="due_date"
                                            type="date"
                                            value={data.due_date}
                                            onChange={(e) => setData('due_date', e.target.value)}
                                            className="focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="is_completed"
                                            checked={data.is_completed}
                                            onChange={(e) => setData('is_completed', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-primary"
                                        />
                                        <Label htmlFor="is_completed">Completed</Label>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full cursor-pointer bg-primary text-white shadow-lg hover:bg-primary/90"
                                    >
                                        {editingTask ? 'Update' : 'Create'}
                                    </Button>
                                </form>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="mb-4 flex flex-col gap-4">
                    <div className="flex gap-4">
                        <form onSubmit={handleSearch} className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                            <Input
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </form>

                        <Select value={completionFilter} onValueChange={handleFilterChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status"></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Tasks</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">List</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Due Date</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {tasks.data.map((task) => (
                                        <tr key={task.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">{task.title}</td>
                                            <td className="max-w-[200px] truncate p-4 align-middle">{task.description || 'No description'}</td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <List className="h-4 w-4 text-muted-foreground" />
                                                    <span>{task.list.title}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {task.due_date ? (
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span>{new Date(task.due_date).toLocaleDateString()}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">No due date</span>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {task.is_completed ? (
                                                    <div className="flex items-center gap-2 text-green-500">
                                                        <span>Completed</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-yellow-500">
                                                        <CheckCircle className="h-4 w-4" />
                                                        <span>Pending</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(task)}
                                                        className="hover:bg-primary/10 hover:text-primary"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(task.id)}
                                                        className="hover:bg-destructive/10 hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {tasks.data.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                                No tasks foreground
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* pagination*/}
                    <div className="flex items-center justify-between px-2">
                        <div className="text-sm text-muted-foreground">
                            Showing {tasks.from} to {tasks.to} of {tasks.total} results
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(tasks.current_page - 1)}
                                className="hover:bg-destructive/10 hover:text-destructive"
                                disabled={tasks.current_page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: tasks.last_page }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={page == tasks.current_page ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>
                            <Button
                                disabled={tasks.current_page === tasks.last_page}
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(tasks.current_page + 1)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
