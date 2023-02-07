

export const Office = window.Office

export async function criarPedido(event) {
    try {
        Office.context.ui.displayDialogAsync('http://localhost:3000/criarPedido', {height: 30, width: 20})
    } catch (error) {
        console.log('Erro:', error.message)
        console.error(error)
    }
    finally {
        event.completed()
    }
}