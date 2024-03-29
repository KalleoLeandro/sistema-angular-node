import { Router } from 'express';
import * as loginController from '../controllers/loginController';
import * as usuarioController from '../controllers/usuarioController';
import * as produtoController from '../controllers/produtoController';
import * as vendaController from '../controllers/vendaController';

const router = Router();


//rotas get

router.get('/listausuarios', usuarioController.listaUsuarios);
router.get('/listausuarioporid', usuarioController.listarUsuarioPorId);
router.get('/listaprodutos', produtoController.listaProdutos);
router.get('/listaprodutoporid', produtoController.listarProductPorId);
router.get('/listaprodutopornome/:nome', produtoController.listaProdutosPorNome);

//rotas post
router.post('/login', loginController.logar);
router.post('/validartoken', loginController.validaToken);
router.post('/userportoken', loginController.userPorToken);
router.post('/validarformulario', usuarioController.validarFormulario);
router.post('/cadastrarusuario', usuarioController.cadastrarUser);
router.post('/cadastrarproduto', produtoController.cadastrarProdutos);
router.post('/adicionarprodutos', produtoController.adicionarProdutos);
router.post('/removerprodutos', produtoController.removerProdutos);
router.post('/efetuarvenda', vendaController.efetuarVenda);


//rotas put
router.put('/atualizarusuario', usuarioController.atualizarUser);


//rotas delete
router.delete('/excluirusuario/:id', usuarioController.excluirUser);    
router.delete('/excluirproduto/:id', produtoController.excluirProduct);



export default router;